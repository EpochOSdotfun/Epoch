import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import pino from 'pino';

const logger = pino({ name: 'router' });

interface Weights {
  rewards: number;
  buyback: number;
  burn: number;
  autoLp: number;
}

export class RouterService {
  private connection: Connection;
  private keypair: Keypair;
  private controllerProgramId: string;
  private distributorProgramId: string;

  constructor(
    connection: Connection,
    keypair: Keypair,
    controllerProgramId: string,
    distributorProgramId: string
  ) {
    this.connection = connection;
    this.keypair = keypair;
    this.controllerProgramId = controllerProgramId;
    this.distributorProgramId = distributorProgramId;
  }

  /**
   * Get current routing weights from on-chain state
   */
  async getWeights(): Promise<Weights> {
    try {
      // Derive controller state PDA
      const [statePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('controller_state')],
        new PublicKey(this.controllerProgramId)
      );

      // Fetch and decode state
      const stateAccount = await this.connection.getAccountInfo(statePda);
      
      if (!stateAccount) {
        // Return defaults if not initialized
        return {
          rewards: 25,
          buyback: 25,
          burn: 25,
          autoLp: 25,
        };
      }

      // Decode weights from account data
      // Skip 8-byte discriminator + 32-byte admin + 1-byte paused
      const data = stateAccount.data;
      const weightsOffset = 8 + 32 + 1;
      
      return {
        rewards: data[weightsOffset],
        buyback: data[weightsOffset + 1],
        burn: data[weightsOffset + 2],
        autoLp: data[weightsOffset + 3],
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get weights');
      // Return defaults on error
      return {
        rewards: 25,
        buyback: 25,
        burn: 25,
        autoLp: 25,
      };
    }
  }

  /**
   * Route SOL to rewards distributor vault
   */
  async routeToRewards(amount: number): Promise<string> {
    try {
      // Derive distributor SOL vault PDA
      const [distributorVault] = PublicKey.findProgramAddressSync(
        [Buffer.from('sol_vault')],
        new PublicKey(this.distributorProgramId)
      );

      // Derive treasury vault
      const [treasuryVault] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury_sol')],
        new PublicKey(this.controllerProgramId)
      );

      // Build route_funds instruction
      // This would call the controller program's route_funds instruction
      // For now, simplified direct transfer
      
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: treasuryVault,
          toPubkey: distributorVault,
          lamports: amount,
        })
      );

      // In production, this would be a CPI through the controller program
      // with proper authority checks
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        tx,
        [this.keypair],
        { commitment: 'confirmed' }
      );

      logger.info({ signature, amount, destination: 'rewards' }, 'Funds routed');

      return signature;
    } catch (error) {
      logger.error({ error, amount }, 'Failed to route to rewards');
      throw error;
    }
  }

  /**
   * Route SOL to buyback (swap SOL to token)
   */
  async routeToBuyback(amount: number): Promise<string> {
    try {
      // This would:
      // 1. Call controller's route_funds with action=Buyback
      // 2. Swap SOL to token
      // 3. Send tokens to reflections vault or distribute
      
      logger.info({ amount, destination: 'buyback' }, 'Routing to buyback');
      
      // Placeholder - implement actual buyback logic
      return 'buyback_signature_placeholder';
    } catch (error) {
      logger.error({ error, amount }, 'Failed to route to buyback');
      throw error;
    }
  }

  /**
   * Route SOL to buy and burn
   */
  async routeToBurn(amount: number): Promise<string> {
    try {
      // This would:
      // 1. Call controller's route_funds with action=Burn
      // 2. Swap SOL to token
      // 3. Burn the tokens
      
      logger.info({ amount, destination: 'burn' }, 'Routing to burn');
      
      // Placeholder - implement actual burn logic
      return 'burn_signature_placeholder';
    } catch (error) {
      logger.error({ error, amount }, 'Failed to route to burn');
      throw error;
    }
  }

  /**
   * Route SOL to auto-LP
   */
  async routeToAutoLp(amount: number): Promise<string> {
    try {
      // This would:
      // 1. Call controller's route_funds with action=AutoLp
      // 2. Swap half to token
      // 3. Add liquidity to LP pool
      
      logger.info({ amount, destination: 'auto_lp' }, 'Routing to auto-LP');
      
      // Placeholder - implement actual auto-LP logic
      return 'auto_lp_signature_placeholder';
    } catch (error) {
      logger.error({ error, amount }, 'Failed to route to auto-LP');
      throw error;
    }
  }

  /**
   * Get treasury balance
   */
  async getTreasuryBalance(): Promise<number> {
    const [treasuryVault] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury_sol')],
      new PublicKey(this.controllerProgramId)
    );

    return await this.connection.getBalance(treasuryVault);
  }
}

