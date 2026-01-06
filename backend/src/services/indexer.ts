import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

// Define TxType locally to avoid Prisma generation dependency
type TxType = 
  | 'FEE_CLAIM'
  | 'SWAP'
  | 'BURN'
  | 'LP_ADD'
  | 'LP_REMOVE'
  | 'EPOCH_PUBLISH'
  | 'CLAIM'
  | 'ROUTE_REWARDS'
  | 'ROUTE_BUYBACK'
  | 'ROUTE_BURN'
  | 'ROUTE_AUTO_LP'
  | 'CONFIG_UPDATE'
  | 'ADMIN_ACTION';

const logger = pino({ name: 'indexer' });

export interface IndexerConfig {
  rpcUrl: string;
  wsUrl?: string;
  tokenMint: string;
  distributorProgramId: string;
  controllerProgramId: string;
  startSlot?: number;
}

export class Indexer {
  private connection: Connection;
  private prisma: PrismaClient;
  private config: IndexerConfig;
  private running = false;
  private subscriptionId: number | null = null;

  constructor(prisma: PrismaClient, config: IndexerConfig) {
    this.prisma = prisma;
    this.config = config;
    this.connection = new Connection(config.rpcUrl, {
      wsEndpoint: config.wsUrl,
      commitment: 'confirmed',
    });
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;

    logger.info('Starting indexer...');

    // Subscribe to token transfers
    await this.subscribeToTokenTransfers();

    // Subscribe to program logs
    await this.subscribeToProgramLogs();

    // Backfill if needed
    await this.backfillIfNeeded();

    logger.info('Indexer started');
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.subscriptionId !== null) {
      await this.connection.removeOnLogsListener(this.subscriptionId);
    }
    logger.info('Indexer stopped');
  }

  private async subscribeToTokenTransfers(): Promise<void> {
    const tokenMint = new PublicKey(this.config.tokenMint);

    // Subscribe to token account changes
    this.connection.onLogs(
      tokenMint,
      async (logs) => {
        if (!this.running) return;

        try {
          await this.processTokenLogs(logs.signature);
        } catch (error) {
          logger.error({ error, signature: logs.signature }, 'Error processing token logs');
        }
      },
      'confirmed'
    );

    logger.info({ tokenMint: this.config.tokenMint }, 'Subscribed to token transfers');
  }

  private async subscribeToProgramLogs(): Promise<void> {
    const distributorProgramId = new PublicKey(this.config.distributorProgramId);

    this.subscriptionId = this.connection.onLogs(
      distributorProgramId,
      async (logs) => {
        if (!this.running) return;

        try {
          await this.processProgramLogs(logs);
        } catch (error) {
          logger.error({ error, signature: logs.signature }, 'Error processing program logs');
        }
      },
      'confirmed'
    );

    logger.info({ programId: this.config.distributorProgramId }, 'Subscribed to program logs');
  }

  private async processTokenLogs(signature: string): Promise<void> {
    // Fetch full transaction
    const tx = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta || tx.meta.err) return;

    // Extract token transfers
    const tokenTransfers = this.extractTokenTransfers(tx);

    for (const transfer of tokenTransfers) {
      logger.debug({ transfer, signature }, 'Token transfer detected');

      // Store transfer for balance tracking
      // This would update wallet balances for the current epoch snapshot
    }
  }

  private async processProgramLogs(logs: { signature: string; logs: string[] }): Promise<void> {
    const { signature, logs: logMessages } = logs;

    // Parse log messages to identify instruction type
    const instructionType = this.parseInstructionType(logMessages);

    if (!instructionType) return;

    // Fetch full transaction for details
    const tx = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta || tx.meta.err) return;

    // Store transaction
    await this.storeTransaction(signature, instructionType, tx);

    // Handle specific events
    switch (instructionType) {
      case 'EPOCH_PUBLISH':
        await this.handleEpochPublish(signature, tx, logMessages);
        break;
      case 'CLAIM':
        await this.handleClaim(signature, tx, logMessages);
        break;
      case 'ROUTE_REWARDS':
      case 'ROUTE_BUYBACK':
      case 'ROUTE_BURN':
      case 'ROUTE_AUTO_LP':
        await this.handleRoute(signature, instructionType, tx);
        break;
    }
  }

  private parseInstructionType(logs: string[]): TxType | null {
    const logStr = logs.join(' ');

    if (logStr.includes('Epoch') && logStr.includes('published')) return TxType.EPOCH_PUBLISH;
    if (logStr.includes('Claimed')) return TxType.CLAIM;
    if (logStr.includes('Routed') && logStr.includes('rewards')) return TxType.ROUTE_REWARDS;
    if (logStr.includes('Routed') && logStr.includes('buyback')) return TxType.ROUTE_BUYBACK;
    if (logStr.includes('Routed') && logStr.includes('burn')) return TxType.ROUTE_BURN;
    if (logStr.includes('Routed') && logStr.includes('auto-LP')) return TxType.ROUTE_AUTO_LP;
    if (logStr.includes('Swap')) return TxType.SWAP;
    if (logStr.includes('Funded')) return TxType.FEE_CLAIM;

    return null;
  }

  private async storeTransaction(
    signature: string,
    type: TxType,
    tx: ParsedTransactionWithMeta
  ): Promise<void> {
    await this.prisma.transaction.upsert({
      where: { signature },
      create: {
        signature,
        type,
        slot: BigInt(tx.slot),
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000) : null,
        success: !tx.meta?.err,
        meta: tx.meta as any,
      },
      update: {
        type,
        slot: BigInt(tx.slot),
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000) : null,
        success: !tx.meta?.err,
      },
    });
  }

  private async handleEpochPublish(
    signature: string,
    tx: ParsedTransactionWithMeta,
    logs: string[]
  ): Promise<void> {
    // Parse epoch details from logs
    // Example log: "Epoch 5 published: 1000000000 SOL, 0 tokens available"
    const epochMatch = logs.join(' ').match(/Epoch (\d+) published: (\d+) SOL, (\d+) tokens/);

    if (!epochMatch) {
      logger.warn({ signature }, 'Could not parse epoch publish details');
      return;
    }

    const [, epochIdStr, rewardsSolStr, rewardsTokenStr] = epochMatch;

    logger.info({
      epochId: epochIdStr,
      rewardsSol: rewardsSolStr,
      signature,
    }, 'Epoch published on-chain');

    // Update epoch in database with publish signature
    await this.prisma.epoch.updateMany({
      where: { epochId: BigInt(epochIdStr) },
      data: { publishSig: signature },
    });
  }

  private async handleClaim(
    signature: string,
    tx: ParsedTransactionWithMeta,
    logs: string[]
  ): Promise<void> {
    // Parse claim details from logs
    // Example: "Claimed 1000000 SOL and 0 tokens for epoch 5 by <wallet>"
    const claimMatch = logs.join(' ').match(
      /Claimed (\d+) SOL and (\d+) tokens for epoch (\d+) by (\w+)/
    );

    if (!claimMatch) {
      logger.warn({ signature }, 'Could not parse claim details');
      return;
    }

    const [, amountSolStr, amountTokenStr, epochIdStr, wallet] = claimMatch;

    // Upsert claim record
    await this.prisma.claim.upsert({
      where: {
        epochId_wallet: {
          epochId: BigInt(epochIdStr),
          wallet,
        },
      },
      create: {
        epochId: BigInt(epochIdStr),
        wallet,
        claimedSol: BigInt(amountSolStr),
        claimedToken: BigInt(amountTokenStr),
        claimSig: signature,
        claimedAt: tx.blockTime ? new Date(tx.blockTime * 1000) : new Date(),
      },
      update: {
        claimSig: signature,
        claimedAt: tx.blockTime ? new Date(tx.blockTime * 1000) : new Date(),
      },
    });

    // Update epoch claimed totals
    await this.prisma.epoch.update({
      where: { epochId: BigInt(epochIdStr) },
      data: {
        claimedSol: { increment: BigInt(amountSolStr) },
        claimedToken: { increment: BigInt(amountTokenStr) },
        numClaimants: { increment: 1 },
      },
    });

    // Invalidate cache
    // await redis.del(`wallet:earnings:${wallet}`);

    logger.info({
      epochId: epochIdStr,
      wallet,
      amountSol: amountSolStr,
      signature,
    }, 'Claim recorded');
  }

  private async handleRoute(
    signature: string,
    type: TxType,
    tx: ParsedTransactionWithMeta
  ): Promise<void> {
    logger.info({ type, signature }, 'Route transaction recorded');
  }

  private extractTokenTransfers(tx: ParsedTransactionWithMeta): Array<{
    source: string;
    destination: string;
    amount: bigint;
  }> {
    const transfers: Array<{ source: string; destination: string; amount: bigint }> = [];

    // Extract from inner instructions
    if (tx.meta?.innerInstructions) {
      for (const inner of tx.meta.innerInstructions) {
        for (const ix of inner.instructions) {
          if ('parsed' in ix && ix.parsed?.type === 'transfer') {
            const info = ix.parsed.info;
            transfers.push({
              source: info.source,
              destination: info.destination,
              amount: BigInt(info.amount),
            });
          }
        }
      }
    }

    return transfers;
  }

  private async backfillIfNeeded(): Promise<void> {
    // Get last processed slot
    const lastTx = await this.prisma.transaction.findFirst({
      orderBy: { slot: 'desc' },
    });

    const lastSlot = lastTx?.slot ? Number(lastTx.slot) : this.config.startSlot || 0;
    const currentSlot = await this.connection.getSlot();

    if (currentSlot - lastSlot > 1000) {
      logger.info({ lastSlot, currentSlot }, 'Backfill needed');
      // Implement backfill logic for missed slots
    }
  }
}

// Factory function
export function createIndexer(prisma: PrismaClient, config: IndexerConfig): Indexer {
  return new Indexer(prisma, config);
}

