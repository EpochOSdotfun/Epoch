import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma, redis } from '../index';
import { PublicKey } from '@solana/web3.js';

const CACHE_TTL = 300; // 5 minutes for proofs

function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function proofRoutes(app: FastifyInstance) {
  // GET /proof/:epoch/:address - Get merkle proof for claiming
  app.get('/:epoch/:address', {
    schema: {
      tags: ['proof'],
      summary: 'Get merkle proof for claiming rewards',
      params: {
        type: 'object',
        properties: {
          epoch: { type: 'integer' },
          address: { type: 'string' },
        },
        required: ['epoch', 'address'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            epochId: { type: 'integer' },
            wallet: { type: 'string' },
            amountSol: { type: 'string' },
            amountToken: { type: 'string' },
            proof: { type: 'array', items: { type: 'string' } },
            leafHash: { type: 'string' },
            merkleRoot: { type: 'string' },
            claimed: { type: 'boolean' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Params: { epoch: number; address: string } }>, reply: FastifyReply) => {
    const { epoch, address } = request.params;

    if (!isValidSolanaAddress(address)) {
      return reply.status(400).send({ error: 'Invalid Solana address' });
    }

    // Check cache
    const cacheKey = `proof:${epoch}:${address}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get allocation
    const allocation = await prisma.allocation.findUnique({
      where: {
        epochId_wallet: {
          epochId: BigInt(epoch),
          wallet: address,
        },
      },
      include: {
        epoch: {
          select: {
            merkleRoot: true,
          },
        },
      },
    });

    if (!allocation) {
      return reply.status(404).send({ 
        error: 'No allocation found for this wallet in this epoch' 
      });
    }

    // Check if already claimed
    const claim = await prisma.claim.findUnique({
      where: {
        epochId_wallet: {
          epochId: BigInt(epoch),
          wallet: address,
        },
      },
    });

    const result = {
      epochId: Number(allocation.epochId),
      wallet: allocation.wallet,
      amountSol: allocation.amountSol.toString(),
      amountToken: allocation.amountToken.toString(),
      proof: allocation.proof,
      leafHash: allocation.leafHash,
      merkleRoot: allocation.epoch.merkleRoot,
      claimed: !!claim,
      claimSig: claim?.claimSig || null,
    };

    // Cache result
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

    return result;
  });

  // POST /proof/simulate-claim - Simulate a claim (convenience endpoint)
  app.post('/simulate-claim', {
    schema: {
      tags: ['proof'],
      summary: 'Simulate a claim transaction',
      body: {
        type: 'object',
        properties: {
          epochId: { type: 'integer' },
          wallet: { type: 'string' },
        },
        required: ['epochId', 'wallet'],
      },
    },
  }, async (request: FastifyRequest<{ 
    Body: { epochId: number; wallet: string } 
  }>, reply: FastifyReply) => {
    const { epochId, wallet } = request.body;

    if (!isValidSolanaAddress(wallet)) {
      return reply.status(400).send({ error: 'Invalid Solana address' });
    }

    // Get allocation and epoch data
    const allocation = await prisma.allocation.findUnique({
      where: {
        epochId_wallet: {
          epochId: BigInt(epochId),
          wallet,
        },
      },
      include: {
        epoch: {
          select: {
            merkleRoot: true,
          },
        },
      },
    });

    if (!allocation) {
      return reply.status(404).send({ 
        error: 'No allocation found',
        canClaim: false,
      });
    }

    // Check if already claimed
    const existingClaim = await prisma.claim.findUnique({
      where: {
        epochId_wallet: {
          epochId: BigInt(epochId),
          wallet,
        },
      },
    });

    if (existingClaim) {
      return {
        canClaim: false,
        reason: 'Already claimed',
        claimSig: existingClaim.claimSig,
        claimedAt: existingClaim.claimedAt.toISOString(),
      };
    }

    return {
      canClaim: true,
      epochId,
      wallet,
      amountSol: allocation.amountSol.toString(),
      amountToken: allocation.amountToken.toString(),
      proof: allocation.proof,
      instructions: {
        programId: process.env.DISTRIBUTOR_PROGRAM_ID,
        instruction: 'claim',
        accounts: [
          { name: 'state', pubkey: 'derived_from_seeds' },
          { name: 'epoch', pubkey: 'derived_from_seeds' },
          { name: 'claimReceipt', pubkey: 'derived_from_seeds' },
          { name: 'solVault', pubkey: 'derived_from_seeds' },
          { name: 'claimant', pubkey: wallet },
          { name: 'systemProgram', pubkey: '11111111111111111111111111111111' },
        ],
        args: {
          epochId,
          amountSol: allocation.amountSol.toString(),
          amountToken: allocation.amountToken.toString(),
          proof: allocation.proof,
        },
      },
    };
  });

  // GET /proof/batch/:address - Get all unclaimed proofs for a wallet
  app.get('/batch/:address', {
    schema: {
      tags: ['proof'],
      summary: 'Get all unclaimed proofs for batch claiming',
      params: {
        type: 'object',
        properties: {
          address: { type: 'string' },
        },
        required: ['address'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { address: string } }>, reply: FastifyReply) => {
    const { address } = request.params;

    if (!isValidSolanaAddress(address)) {
      return reply.status(400).send({ error: 'Invalid Solana address' });
    }

    // Get all allocations
    const allocations = await prisma.allocation.findMany({
      where: { wallet: address },
      include: {
        epoch: {
          select: {
            merkleRoot: true,
          },
        },
      },
    });

    // Get claimed epochs
    const claims = await prisma.claim.findMany({
      where: { wallet: address },
      select: { epochId: true },
    });

    const claimedSet = new Set(claims.map(c => Number(c.epochId)));

    const unclaimedProofs = allocations
      .filter(a => !claimedSet.has(Number(a.epochId)))
      .map(a => ({
        epochId: Number(a.epochId),
        amountSol: a.amountSol.toString(),
        amountToken: a.amountToken.toString(),
        proof: a.proof,
        leafHash: a.leafHash,
        merkleRoot: a.epoch.merkleRoot,
      }));

    return {
      wallet: address,
      proofs: unclaimedProofs,
      count: unclaimedProofs.length,
      totalSol: unclaimedProofs.reduce((sum, p) => sum + BigInt(p.amountSol), 0n).toString(),
      totalToken: unclaimedProofs.reduce((sum, p) => sum + BigInt(p.amountToken), 0n).toString(),
    };
  });
}


