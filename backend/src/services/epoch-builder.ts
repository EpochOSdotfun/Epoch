import { PrismaClient } from '@prisma/client';
import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const logger = pino({ name: 'epoch-builder' });

export interface EpochBuilderConfig {
  rpcUrl: string;
  tokenMint: string;
  distributorProgramId: string;
  excludedAddresses: string[]; // Burn address, LP vaults, treasury, etc.
  epochDuration: number; // in seconds
  outputDir: string; // for CSV/audit files
}

export interface WalletAllocation {
  wallet: string;
  balance: bigint;
  allocation: bigint;
  allocationToken: bigint;
}

export interface EpochData {
  epochId: number;
  startSlot: number;
  endSlot: number;
  merkleRoot: string;
  totalRewardsSol: bigint;
  totalRewardsToken: bigint;
  allocations: WalletAllocation[];
  csvHash: string;
}

export class EpochBuilder {
  private prisma: PrismaClient;
  private connection: Connection;
  private config: EpochBuilderConfig;

  constructor(prisma: PrismaClient, config: EpochBuilderConfig) {
    this.prisma = prisma;
    this.config = config;
    this.connection = new Connection(config.rpcUrl, 'confirmed');
  }

  /**
   * Build a new epoch from current state
   */
  async buildEpoch(rewardsSol: bigint, rewardsToken: bigint = 0n): Promise<EpochData> {
    logger.info({ rewardsSol: rewardsSol.toString() }, 'Building new epoch');

    // Get current epoch number
    const lastEpoch = await this.prisma.epoch.findFirst({
      orderBy: { epochId: 'desc' },
    });
    const newEpochId = lastEpoch ? Number(lastEpoch.epochId) + 1 : 1;

    // Get current slot
    const currentSlot = await this.connection.getSlot();
    const startSlot = lastEpoch ? Number(lastEpoch.endSlot) + 1 : currentSlot - 1000;

    // Snapshot token balances
    const balances = await this.snapshotBalances(currentSlot);

    // Calculate eligible supply
    const eligibleSupply = balances.reduce((sum, b) => sum + b.balance, 0n);

    if (eligibleSupply === 0n) {
      throw new Error('No eligible supply for rewards');
    }

    // Calculate allocations
    const allocations = this.calculateAllocations(
      balances,
      eligibleSupply,
      rewardsSol,
      rewardsToken
    );

    // Build Merkle tree
    const { merkleRoot, tree, leaves } = this.buildMerkleTree(allocations, newEpochId);

    // Generate proofs and store
    const allocationsWithProofs = allocations.map((a, i) => ({
      ...a,
      proof: tree.getHexProof(leaves[i]),
      leafHash: leaves[i].toString('hex'),
    }));

    // Generate CSV for transparency
    const csvHash = await this.generateAuditArtifacts(
      newEpochId,
      allocationsWithProofs,
      merkleRoot,
      eligibleSupply
    );

    // Store in database
    await this.storeEpoch(
      newEpochId,
      startSlot,
      currentSlot,
      merkleRoot,
      rewardsSol,
      rewardsToken,
      allocationsWithProofs,
      csvHash
    );

    logger.info({
      epochId: newEpochId,
      merkleRoot,
      totalAllocations: allocations.length,
      eligibleSupply: eligibleSupply.toString(),
    }, 'Epoch built successfully');

    return {
      epochId: newEpochId,
      startSlot,
      endSlot: currentSlot,
      merkleRoot,
      totalRewardsSol: rewardsSol,
      totalRewardsToken: rewardsToken,
      allocations,
      csvHash,
    };
  }

  /**
   * Snapshot token balances at a specific slot
   */
  private async snapshotBalances(slot: number): Promise<Array<{ wallet: string; balance: bigint }>> {
    const tokenMint = new PublicKey(this.config.tokenMint);

    // Get all token accounts for this mint
    const accounts = await this.connection.getParsedProgramAccounts(
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      {
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 0, bytes: tokenMint.toBase58() } },
        ],
      }
    );

    const excludedSet = new Set(this.config.excludedAddresses.map(a => a.toLowerCase()));
    const balances: Array<{ wallet: string; balance: bigint }> = [];

    for (const account of accounts) {
      const parsed = account.account.data as any;
      if (parsed.parsed?.info) {
        const { owner, tokenAmount } = parsed.parsed.info;

        // Skip excluded addresses
        if (excludedSet.has(owner.toLowerCase())) continue;

        // Skip zero balances
        const balance = BigInt(tokenAmount.amount);
        if (balance === 0n) continue;

        balances.push({ wallet: owner, balance });
      }
    }

    // Also check blacklist
    const blacklisted = await this.prisma.blacklist.findMany({
      select: { wallet: true },
    });
    const blacklistSet = new Set(blacklisted.map(b => b.wallet.toLowerCase()));

    return balances.filter(b => !blacklistSet.has(b.wallet.toLowerCase()));
  }

  /**
   * Calculate allocation for each wallet based on balance share
   */
  private calculateAllocations(
    balances: Array<{ wallet: string; balance: bigint }>,
    eligibleSupply: bigint,
    totalRewardsSol: bigint,
    totalRewardsToken: bigint
  ): WalletAllocation[] {
    return balances.map(({ wallet, balance }) => {
      // allocation = (balance / eligibleSupply) * totalRewards
      // Use BigInt math to avoid precision loss
      const allocationSol = (balance * totalRewardsSol) / eligibleSupply;
      const allocationToken = (balance * totalRewardsToken) / eligibleSupply;

      return {
        wallet,
        balance,
        allocation: allocationSol,
        allocationToken,
      };
    }).filter(a => a.allocation > 0n || a.allocationToken > 0n);
  }

  /**
   * Build Merkle tree from allocations
   */
  private buildMerkleTree(allocations: WalletAllocation[], epochId: number): {
    merkleRoot: string;
    tree: MerkleTree;
    leaves: Buffer[];
  } {
    // Create leaves: keccak256(wallet, epochId, amountSol, amountToken)
    const leaves = allocations.map(a => {
      return keccak256(
        Buffer.concat([
          Buffer.from(a.wallet),
          this.toLeBytes(BigInt(epochId)),
          this.toLeBytes(a.allocation),
          this.toLeBytes(a.allocationToken),
        ])
      );
    });

    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = tree.getHexRoot();

    return { merkleRoot, tree, leaves };
  }

  /**
   * Convert BigInt to little-endian bytes
   */
  private toLeBytes(value: bigint): Buffer {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(value);
    return buf;
  }

  /**
   * Generate audit artifacts (CSV, checksums)
   */
  private async generateAuditArtifacts(
    epochId: number,
    allocations: Array<WalletAllocation & { proof: string[]; leafHash: string }>,
    merkleRoot: string,
    eligibleSupply: bigint
  ): Promise<string> {
    const outputDir = this.config.outputDir;

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate CSV
    const csvLines = [
      'wallet,balance,allocation_sol,allocation_token,leaf_hash',
      ...allocations.map(a =>
        `${a.wallet},${a.balance},${a.allocation},${a.allocationToken},${a.leafHash}`
      ),
    ];
    const csvContent = csvLines.join('\n');
    const csvPath = path.join(outputDir, `epoch-${epochId}.csv`);
    fs.writeFileSync(csvPath, csvContent);

    // Calculate CSV hash
    const csvHash = crypto.createHash('sha256').update(csvContent).digest('hex');

    // Generate summary JSON
    const summary = {
      epochId,
      merkleRoot,
      totalAllocations: allocations.length,
      eligibleSupply: eligibleSupply.toString(),
      totalRewardsSol: allocations.reduce((sum, a) => sum + a.allocation, 0n).toString(),
      totalRewardsToken: allocations.reduce((sum, a) => sum + a.allocationToken, 0n).toString(),
      csvHash,
      generatedAt: new Date().toISOString(),
    };
    const summaryPath = path.join(outputDir, `epoch-${epochId}-summary.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    logger.info({ epochId, csvPath, csvHash }, 'Audit artifacts generated');

    return csvHash;
  }

  /**
   * Store epoch data in database
   */
  private async storeEpoch(
    epochId: number,
    startSlot: number,
    endSlot: number,
    merkleRoot: string,
    rewardsSol: bigint,
    rewardsToken: bigint,
    allocations: Array<WalletAllocation & { proof: string[]; leafHash: string }>,
    csvHash: string
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Create epoch
      await tx.epoch.create({
        data: {
          epochId: BigInt(epochId),
          startSlot: BigInt(startSlot),
          endSlot: BigInt(endSlot),
          merkleRoot,
          rewardsSol,
          rewardsToken,
          csvHash,
          publishedAt: new Date(),
        },
      });

      // Create allocations in batches
      const batchSize = 500;
      for (let i = 0; i < allocations.length; i += batchSize) {
        const batch = allocations.slice(i, i + batchSize);
        await tx.allocation.createMany({
          data: batch.map(a => ({
            epochId: BigInt(epochId),
            wallet: a.wallet,
            amountSol: a.allocation,
            amountToken: a.allocationToken,
            leafHash: a.leafHash,
            proof: a.proof,
          })),
        });
      }

      // Update wallet stats
      for (const a of allocations) {
        await tx.walletStats.upsert({
          where: { wallet: a.wallet },
          create: {
            wallet: a.wallet,
            totalEarnedSol: a.allocation,
            totalEarnedToken: a.allocationToken,
            firstEligibleEpoch: BigInt(epochId),
          },
          update: {
            totalEarnedSol: { increment: a.allocation },
            totalEarnedToken: { increment: a.allocationToken },
          },
        });
      }
    });
  }

  /**
   * Verify epoch reconciliation
   */
  async verifyReconciliation(epochId: number): Promise<{
    valid: boolean;
    expectedTotal: string;
    actualTotal: string;
    drift: string;
  }> {
    const epoch = await this.prisma.epoch.findUnique({
      where: { epochId: BigInt(epochId) },
    });

    if (!epoch) {
      throw new Error('Epoch not found');
    }

    const allocationsSum = await this.prisma.allocation.aggregate({
      where: { epochId: BigInt(epochId) },
      _sum: {
        amountSol: true,
      },
    });

    const expectedTotal = epoch.rewardsSol;
    const actualTotal = allocationsSum._sum.amountSol || 0n;
    const drift = expectedTotal - actualTotal;

    // Allow for small rounding errors (< 1000 lamports)
    const valid = drift >= -1000n && drift <= 1000n;

    return {
      valid,
      expectedTotal: expectedTotal.toString(),
      actualTotal: actualTotal.toString(),
      drift: drift.toString(),
    };
  }
}

// Factory function
export function createEpochBuilder(prisma: PrismaClient, config: EpochBuilderConfig): EpochBuilder {
  return new EpochBuilder(prisma, config);
}

