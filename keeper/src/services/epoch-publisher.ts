import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { PrismaClient } from '@prisma/client';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import pino from 'pino';

const logger = pino({ name: 'epoch-publisher' });

interface PublishResult {
  signature: string;
  epochId: number;
  merkleRoot: string;
  totalAllocations: number;
}

export class EpochPublisher {
  private connection: Connection;
  private keypair: Keypair;
  private prisma: PrismaClient;
  private distributorProgramId: string;

  constructor(
    connection: Connection,
    keypair: Keypair,
    prisma: PrismaClient,
    distributorProgramId: string
  ) {
    this.connection = connection;
    this.keypair = keypair;
    this.prisma = prisma;
    this.distributorProgramId = distributorProgramId;
  }

  /**
   * Build and publish a new epoch on-chain
   */
  async publish(rewardsSol: bigint, rewardsToken: bigint = 0n): Promise<PublishResult> {
    logger.info({ rewardsSol: rewardsSol.toString() }, 'Publishing new epoch');

    // Get current epoch from database
    const lastEpoch = await this.prisma.epoch.findFirst({
      orderBy: { epochId: 'desc' },
    });

    const newEpochId = lastEpoch ? Number(lastEpoch.epochId) + 1 : 1;

    // Get current slot
    const currentSlot = await this.connection.getSlot();
    const startSlot = lastEpoch ? Number(lastEpoch.endSlot) + 1 : currentSlot - 1000;

    // Get allocations from the epoch builder (would be stored in DB)
    // For now, we'll assume the epoch was already built
    const epoch = await this.prisma.epoch.findFirst({
      where: { epochId: BigInt(newEpochId) },
      include: { allocations: true },
    });

    if (!epoch) {
      // Build the epoch if not already built
      // In production, this would call the epoch builder service
      throw new Error('Epoch not built yet. Run epoch builder first.');
    }

    // Verify merkle root
    const leaves = epoch.allocations.map(a => 
      keccak256(
        Buffer.concat([
          Buffer.from(a.wallet),
          this.toLeBytes(BigInt(newEpochId)),
          this.toLeBytes(a.amountSol),
          this.toLeBytes(a.amountToken),
        ])
      )
    );

    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const computedRoot = tree.getHexRoot();

    if (computedRoot !== epoch.merkleRoot) {
      throw new Error('Merkle root mismatch - data integrity issue');
    }

    // Build publish_epoch instruction
    const signature = await this.publishOnChain(
      newEpochId,
      epoch.merkleRoot,
      rewardsSol,
      rewardsToken,
      BigInt(startSlot),
      BigInt(currentSlot)
    );

    // Update epoch with publish signature
    await this.prisma.epoch.update({
      where: { epochId: BigInt(newEpochId) },
      data: { publishSig: signature },
    });

    logger.info({
      epochId: newEpochId,
      merkleRoot: epoch.merkleRoot,
      signature,
      totalAllocations: epoch.allocations.length,
    }, 'Epoch published successfully');

    return {
      signature,
      epochId: newEpochId,
      merkleRoot: epoch.merkleRoot,
      totalAllocations: epoch.allocations.length,
    };
  }

  /**
   * Publish epoch on-chain
   */
  private async publishOnChain(
    epochId: number,
    merkleRoot: string,
    rewardsSol: bigint,
    rewardsToken: bigint,
    startSlot: bigint,
    endSlot: bigint
  ): Promise<string> {
    // Derive PDAs
    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('distributor_state')],
      new PublicKey(this.distributorProgramId)
    );

    const [epochPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('epoch'), this.toLeBytes(BigInt(epochId))],
      new PublicKey(this.distributorProgramId)
    );

    // Build instruction data
    // Discriminator (8 bytes) + epoch_id (8) + merkle_root (32) + rewards_sol (8) + rewards_token (8) + start_slot (8) + end_slot (8)
    const discriminator = Buffer.from([/* publish_epoch discriminator */]);
    
    // In production, use Anchor's instruction builder
    // This is a simplified example
    
    const tx = new Transaction();
    // Add the publish_epoch instruction
    // tx.add(publishEpochInstruction);

    const signature = await sendAndConfirmTransaction(
      this.connection,
      tx,
      [this.keypair],
      { commitment: 'confirmed' }
    );

    return signature;
  }

  /**
   * Verify an epoch's merkle root matches the allocations
   */
  async verifyEpoch(epochId: number): Promise<boolean> {
    const epoch = await this.prisma.epoch.findUnique({
      where: { epochId: BigInt(epochId) },
      include: { allocations: true },
    });

    if (!epoch) return false;

    const leaves = epoch.allocations.map(a =>
      keccak256(
        Buffer.concat([
          Buffer.from(a.wallet),
          this.toLeBytes(BigInt(epochId)),
          this.toLeBytes(a.amountSol),
          this.toLeBytes(a.amountToken),
        ])
      )
    );

    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const computedRoot = tree.getHexRoot();

    return computedRoot === epoch.merkleRoot;
  }

  /**
   * Get proof for a specific wallet
   */
  async getProof(epochId: number, wallet: string): Promise<string[] | null> {
    const allocation = await this.prisma.allocation.findUnique({
      where: {
        epochId_wallet: {
          epochId: BigInt(epochId),
          wallet,
        },
      },
    });

    return allocation?.proof || null;
  }

  private toLeBytes(value: bigint): Buffer {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(value);
    return buf;
  }
}


