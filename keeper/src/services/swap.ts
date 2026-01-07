import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import pino from 'pino';
import axios from 'axios';

const logger = pino({ name: 'swap' });

interface SwapConfig {
  maxSlippageBps: number;
  maxTradeSize: number;
}

interface Quote {
  expectedOutput: number;
  minimumOutput: number;
  priceImpact: number;
  route: string[];
}

interface SwapResult {
  signature: string;
  amountIn: number;
  amountOut: number;
}

export class SwapService {
  private connection: Connection;
  private keypair: Keypair;
  private dexProgramId: string;
  private controllerProgramId: string;
  private config: SwapConfig;

  constructor(
    connection: Connection,
    keypair: Keypair,
    dexProgramId: string,
    controllerProgramId: string,
    config: SwapConfig
  ) {
    this.connection = connection;
    this.keypair = keypair;
    this.dexProgramId = dexProgramId;
    this.controllerProgramId = controllerProgramId;
    this.config = config;
  }

  /**
   * Get token balance for keeper/treasury
   */
  async getTokenBalance(tokenMint: string): Promise<number> {
    try {
      const mintPubkey = new PublicKey(tokenMint);
      const ata = await getAssociatedTokenAddress(mintPubkey, this.keypair.publicKey);
      
      try {
        const account = await getAccount(this.connection, ata);
        return Number(account.amount);
      } catch {
        // Account doesn't exist = 0 balance
        return 0;
      }
    } catch (error) {
      logger.error({ error, tokenMint }, 'Failed to get token balance');
      throw error;
    }
  }

  /**
   * Get swap quote from DEX aggregator
   * Using Jupiter API as example
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number
  ): Promise<Quote> {
    try {
      // Convert 'SOL' to native mint
      const inputMintAddress = inputMint === 'SOL' 
        ? 'So11111111111111111111111111111111111111112'
        : inputMint;
      const outputMintAddress = outputMint === 'SOL'
        ? 'So11111111111111111111111111111111111111112'
        : outputMint;

      // Get quote from Jupiter
      const response = await axios.get('https://quote-api.jup.ag/v6/quote', {
        params: {
          inputMint: inputMintAddress,
          outputMint: outputMintAddress,
          amount: amount.toString(),
          slippageBps: this.config.maxSlippageBps,
        },
      });

      const data = response.data;

      return {
        expectedOutput: parseInt(data.outAmount),
        minimumOutput: parseInt(data.otherAmountThreshold),
        priceImpact: parseFloat(data.priceImpactPct),
        route: data.routePlan?.map((r: any) => r.swapInfo?.label || 'unknown') || [],
      };
    } catch (error) {
      logger.error({ error, inputMint, outputMint, amount }, 'Failed to get quote');
      throw error;
    }
  }

  /**
   * Execute swap through DEX
   */
  async executeSwap(
    inputMint: string,
    outputMint: string,
    amountIn: number,
    minAmountOut: number
  ): Promise<SwapResult> {
    try {
      // Validate trade size
      if (amountIn > this.config.maxTradeSize) {
        throw new Error(`Trade size ${amountIn} exceeds max ${this.config.maxTradeSize}`);
      }

      // Convert 'SOL' to native mint
      const inputMintAddress = inputMint === 'SOL'
        ? 'So11111111111111111111111111111111111111112'
        : inputMint;
      const outputMintAddress = outputMint === 'SOL'
        ? 'So11111111111111111111111111111111111111112'
        : outputMint;

      // Get swap transaction from Jupiter
      const quoteResponse = await axios.get('https://quote-api.jup.ag/v6/quote', {
        params: {
          inputMint: inputMintAddress,
          outputMint: outputMintAddress,
          amount: amountIn.toString(),
          slippageBps: this.config.maxSlippageBps,
        },
      });

      const swapResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse: quoteResponse.data,
        userPublicKey: this.keypair.publicKey.toBase58(),
        wrapAndUnwrapSol: true,
      });

      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapResponse.data.swapTransaction, 'base64');
      const transaction = Transaction.from(swapTransactionBuf);

      // Sign and send
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.keypair],
        { commitment: 'confirmed' }
      );

      // Get actual output amount from transaction
      const txInfo = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      const actualOutput = parseInt(quoteResponse.data.outAmount);

      logger.info({
        signature,
        amountIn,
        amountOut: actualOutput,
        inputMint,
        outputMint,
      }, 'Swap executed');

      return {
        signature,
        amountIn,
        amountOut: actualOutput,
      };
    } catch (error) {
      logger.error({ error, inputMint, outputMint, amountIn }, 'Failed to execute swap');
      throw error;
    }
  }

  /**
   * Validate swap parameters against controller config
   */
  async validateSwap(amountIn: number, expectedSlippage: number): Promise<boolean> {
    if (amountIn > this.config.maxTradeSize) {
      logger.warn({ amountIn, maxTradeSize: this.config.maxTradeSize }, 'Trade size exceeds max');
      return false;
    }

    if (expectedSlippage > this.config.maxSlippageBps) {
      logger.warn({ expectedSlippage, maxSlippageBps: this.config.maxSlippageBps }, 'Slippage exceeds max');
      return false;
    }

    return true;
  }
}


