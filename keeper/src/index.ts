import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { PrismaClient, AlertType, AlertSeverity } from '@prisma/client';
import * as cron from 'node-cron';
import pino from 'pino';
import 'dotenv/config';
import * as fs from 'fs';

import { FeeClaimService } from './services/fee-claim';
import { SwapService } from './services/swap';
import { RouterService } from './services/router';
import { EpochPublisher } from './services/epoch-publisher';
import { CircuitBreaker } from './services/circuit-breaker';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' } 
    : undefined,
});

interface KeeperConfig {
  rpcUrl: string;
  keypairPath: string;
  distributorProgramId: string;
  controllerProgramId: string;
  tokenMint: string;
  lpPoolAddress: string;
  dexProgramId: string;
  feeClaimThreshold: number; // Minimum fees before claiming (in SOL)
  maxSlippageBps: number;
  maxTradeSize: number; // in lamports
  epochDuration: number; // in hours
}

class Keeper {
  private connection: Connection;
  private prisma: PrismaClient;
  private keypair: Keypair;
  private config: KeeperConfig;
  private feeClaimService: FeeClaimService;
  private swapService: SwapService;
  private routerService: RouterService;
  private epochPublisher: EpochPublisher;
  private circuitBreaker: CircuitBreaker;
  private running = false;

  constructor(config: KeeperConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.prisma = new PrismaClient();
    
    // Load keeper keypair
    const keypairData = JSON.parse(fs.readFileSync(config.keypairPath, 'utf-8'));
    this.keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));

    logger.info({ keeper: this.keypair.publicKey.toBase58() }, 'Keeper initialized');

    // Initialize services
    this.circuitBreaker = new CircuitBreaker(this.prisma, {
      maxFailures: 3,
      resetTimeout: 60000, // 1 minute
    });

    this.feeClaimService = new FeeClaimService(
      this.connection,
      this.keypair,
      config.lpPoolAddress,
      config.controllerProgramId
    );

    this.swapService = new SwapService(
      this.connection,
      this.keypair,
      config.dexProgramId,
      config.controllerProgramId,
      {
        maxSlippageBps: config.maxSlippageBps,
        maxTradeSize: config.maxTradeSize,
      }
    );

    this.routerService = new RouterService(
      this.connection,
      this.keypair,
      config.controllerProgramId,
      config.distributorProgramId
    );

    this.epochPublisher = new EpochPublisher(
      this.connection,
      this.keypair,
      this.prisma,
      config.distributorProgramId
    );
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;

    logger.info('Starting keeper bot...');

    // Check if paused
    const isPaused = await this.checkPaused();
    if (isPaused) {
      logger.warn('Keeper is paused. Not starting automation.');
      return;
    }

    // Schedule jobs
    this.scheduleJobs();

    // Run initial check
    await this.runCycle();

    logger.info('Keeper bot started');
  }

  async stop(): Promise<void> {
    this.running = false;
    await this.prisma.$disconnect();
    logger.info('Keeper bot stopped');
  }

  private scheduleJobs(): void {
    // Check for claimable fees every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      if (!this.running) return;
      try {
        await this.checkAndClaimFees();
      } catch (error) {
        logger.error({ error }, 'Fee claim job failed');
      }
    });

    // Run full cycle every hour
    cron.schedule('0 * * * *', async () => {
      if (!this.running) return;
      try {
        await this.runCycle();
      } catch (error) {
        logger.error({ error }, 'Cycle job failed');
      }
    });

    // Health check every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      if (!this.running) return;
      try {
        await this.healthCheck();
      } catch (error) {
        logger.error({ error }, 'Health check failed');
      }
    });

    logger.info('Jobs scheduled');
  }

  /**
   * Run a full keeper cycle:
   * 1. Claim LP fees
   * 2. Swap tokens to SOL
   * 3. Route SOL according to weights
   * 4. If rewards funded, publish new epoch
   */
  async runCycle(): Promise<void> {
    logger.info('Starting keeper cycle');

    // Check circuit breaker
    if (this.circuitBreaker.isOpen()) {
      logger.warn('Circuit breaker is open. Skipping cycle.');
      await this.createAlert(
        AlertType.CIRCUIT_BREAKER,
        AlertSeverity.WARNING,
        'Circuit breaker is open, skipping keeper cycle'
      );
      return;
    }

    try {
      // Step 1: Claim LP fees
      const feesResult = await this.checkAndClaimFees();
      if (feesResult.claimed) {
        logger.info({ amount: feesResult.amount }, 'Fees claimed');
      }

      // Step 2: Swap tokens to SOL if needed
      const swapResult = await this.swapTokensToSol();
      if (swapResult.swapped) {
        logger.info({ 
          amountIn: swapResult.amountIn, 
          amountOut: swapResult.amountOut 
        }, 'Tokens swapped to SOL');
      }

      // Step 3: Get treasury balance and route according to weights
      const treasuryBalance = await this.getTreasuryBalance();
      if (treasuryBalance > 0) {
        const routeResult = await this.routeFunds(treasuryBalance);
        logger.info({ routeResult }, 'Funds routed');

        // Step 4: If rewards were funded, check if epoch should be published
        if (routeResult.rewardsFunded > 0) {
          const shouldPublish = await this.shouldPublishEpoch();
          if (shouldPublish) {
            await this.publishEpoch(routeResult.rewardsFunded);
          }
        }
      }

      // Reset circuit breaker on success
      this.circuitBreaker.recordSuccess();

      logger.info('Keeper cycle completed successfully');

    } catch (error: any) {
      this.circuitBreaker.recordFailure();
      logger.error({ error }, 'Keeper cycle failed');
      await this.createAlert(
        AlertType.CIRCUIT_BREAKER,
        AlertSeverity.ERROR,
        `Keeper cycle failed: ${error.message}`
      );
      throw error;
    }
  }

  private async checkAndClaimFees(): Promise<{ claimed: boolean; amount: number }> {
    // Check pending fees
    const pendingFees = await this.feeClaimService.getPendingFees();

    if (pendingFees < this.config.feeClaimThreshold) {
      logger.debug({ pendingFees }, 'Pending fees below threshold');
      return { claimed: false, amount: 0 };
    }

    // Claim fees
    const signature = await this.feeClaimService.claimFees();
    logger.info({ signature, amount: pendingFees }, 'Fees claimed');

    // Record transaction
    await this.recordTransaction(signature, 'FEE_CLAIM', { amount: pendingFees });

    return { claimed: true, amount: pendingFees };
  }

  private async swapTokensToSol(): Promise<{ 
    swapped: boolean; 
    amountIn: number; 
    amountOut: number 
  }> {
    // Check token balance
    const tokenBalance = await this.swapService.getTokenBalance(this.config.tokenMint);

    if (tokenBalance === 0) {
      return { swapped: false, amountIn: 0, amountOut: 0 };
    }

    // Get quote
    const quote = await this.swapService.getQuote(
      this.config.tokenMint,
      'SOL',
      tokenBalance
    );

    // Check slippage
    const slippageBps = this.calculateSlippage(quote.expectedOutput, quote.minimumOutput);
    if (slippageBps > this.config.maxSlippageBps) {
      logger.warn({ slippageBps }, 'Slippage too high, skipping swap');
      await this.createAlert(
        AlertType.SLIPPAGE_EXCEEDED,
        AlertSeverity.WARNING,
        `Swap slippage ${slippageBps}bps exceeds max ${this.config.maxSlippageBps}bps`
      );
      return { swapped: false, amountIn: 0, amountOut: 0 };
    }

    // Execute swap
    const result = await this.swapService.executeSwap(
      this.config.tokenMint,
      'SOL',
      tokenBalance,
      quote.minimumOutput
    );

    // Record transaction
    await this.recordTransaction(result.signature, 'SWAP', {
      amountIn: tokenBalance,
      amountOut: result.amountOut,
      slippageBps,
    });

    return { swapped: true, amountIn: tokenBalance, amountOut: result.amountOut };
  }

  private async routeFunds(totalAmount: number): Promise<{
    rewardsFunded: number;
    buybackFunded: number;
    burnFunded: number;
    autoLpFunded: number;
  }> {
    // Get current weights from on-chain state
    const weights = await this.routerService.getWeights();

    const rewardsAmount = Math.floor(totalAmount * weights.rewards / 100);
    const buybackAmount = Math.floor(totalAmount * weights.buyback / 100);
    const burnAmount = Math.floor(totalAmount * weights.burn / 100);
    const autoLpAmount = Math.floor(totalAmount * weights.autoLp / 100);

    const results = {
      rewardsFunded: 0,
      buybackFunded: 0,
      burnFunded: 0,
      autoLpFunded: 0,
    };

    // Route to rewards
    if (rewardsAmount > 0) {
      const sig = await this.routerService.routeToRewards(rewardsAmount);
      await this.recordTransaction(sig, 'ROUTE_REWARDS', { amount: rewardsAmount });
      results.rewardsFunded = rewardsAmount;
    }

    // Route to buyback
    if (buybackAmount > 0) {
      const sig = await this.routerService.routeToBuyback(buybackAmount);
      await this.recordTransaction(sig, 'ROUTE_BUYBACK', { amount: buybackAmount });
      results.buybackFunded = buybackAmount;
    }

    // Route to burn
    if (burnAmount > 0) {
      const sig = await this.routerService.routeToBurn(burnAmount);
      await this.recordTransaction(sig, 'ROUTE_BURN', { amount: burnAmount });
      results.burnFunded = burnAmount;
    }

    // Route to auto-LP
    if (autoLpAmount > 0) {
      const sig = await this.routerService.routeToAutoLp(autoLpAmount);
      await this.recordTransaction(sig, 'ROUTE_AUTO_LP', { amount: autoLpAmount });
      results.autoLpFunded = autoLpAmount;
    }

    return results;
  }

  private async shouldPublishEpoch(): Promise<boolean> {
    // Check time since last epoch
    const lastEpoch = await this.prisma.epoch.findFirst({
      orderBy: { epochId: 'desc' },
    });

    if (!lastEpoch) return true;

    const hoursSinceLastEpoch = 
      (Date.now() - lastEpoch.publishedAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastEpoch >= this.config.epochDuration;
  }

  private async publishEpoch(rewardsAmount: number): Promise<void> {
    logger.info({ rewardsAmount }, 'Publishing new epoch');

    const result = await this.epochPublisher.publish(BigInt(rewardsAmount));

    await this.recordTransaction(result.signature, 'EPOCH_PUBLISH', {
      epochId: result.epochId,
      merkleRoot: result.merkleRoot,
      totalAllocations: result.totalAllocations,
    });

    logger.info({
      epochId: result.epochId,
      signature: result.signature,
    }, 'Epoch published');
  }

  private async getTreasuryBalance(): Promise<number> {
    // Get treasury PDA balance
    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury_sol')],
      new PublicKey(this.config.controllerProgramId)
    );

    const balance = await this.connection.getBalance(treasuryPda);
    return balance;
  }

  private async checkPaused(): Promise<boolean> {
    // Check on-chain paused state
    // This would read from the Controller program state
    return false;
  }

  private async healthCheck(): Promise<void> {
    // Check RPC connection
    try {
      await this.connection.getSlot();
    } catch (error) {
      await this.createAlert(
        AlertType.RPC_ERROR,
        AlertSeverity.ERROR,
        'RPC connection failed'
      );
      throw error;
    }

    // Check keeper balance
    const balance = await this.connection.getBalance(this.keypair.publicKey);
    if (balance < 50000000) { // 0.05 SOL
      await this.createAlert(
        AlertType.LOW_TREASURY,
        AlertSeverity.WARNING,
        `Keeper balance low: ${balance / 1e9} SOL`
      );
    }

    logger.debug('Health check passed');
  }

  private calculateSlippage(expected: number, actual: number): number {
    if (expected === 0) return 0;
    return Math.floor(((expected - actual) / expected) * 10000);
  }

  private async recordTransaction(
    signature: string,
    type: string,
    meta: Record<string, any>
  ): Promise<void> {
    const slot = await this.connection.getSlot();

    await this.prisma.transaction.create({
      data: {
        signature,
        type: type as any,
        slot: BigInt(slot),
        blockTime: new Date(),
        success: true,
        meta,
      },
    });
  }

  private async createAlert(
    type: AlertType,
    severity: AlertSeverity,
    message: string,
    meta?: Record<string, any>
  ): Promise<void> {
    await this.prisma.alert.create({
      data: {
        type,
        severity,
        message,
        meta,
      },
    });

    // Log based on severity
    const logMethod = severity === AlertSeverity.CRITICAL || severity === AlertSeverity.ERROR
      ? 'error'
      : severity === AlertSeverity.WARNING
        ? 'warn'
        : 'info';

    logger[logMethod]({ type, severity, message, meta }, 'Alert created');
  }
}

// Load config and start
const config: KeeperConfig = {
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  keypairPath: process.env.KEEPER_KEYPAIR_PATH || './keeper-keypair.json',
  distributorProgramId: process.env.DISTRIBUTOR_PROGRAM_ID || '',
  controllerProgramId: process.env.CONTROLLER_PROGRAM_ID || '',
  tokenMint: process.env.TOKEN_MINT || '',
  lpPoolAddress: process.env.LP_POOL_ADDRESS || '',
  dexProgramId: process.env.DEX_PROGRAM_ID || '',
  feeClaimThreshold: parseFloat(process.env.FEE_CLAIM_THRESHOLD || '0.1'),
  maxSlippageBps: parseInt(process.env.MAX_SLIPPAGE_BPS || '100'),
  maxTradeSize: parseInt(process.env.MAX_TRADE_SIZE || '1000000000'),
  epochDuration: parseInt(process.env.EPOCH_DURATION_HOURS || '24'),
};

const keeper = new Keeper(config);

// Handle signals
process.on('SIGINT', async () => {
  logger.info('Received SIGINT');
  await keeper.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM');
  await keeper.stop();
  process.exit(0);
});

// Start
keeper.start().catch((error) => {
  logger.error({ error }, 'Failed to start keeper');
  process.exit(1);
});

