import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma, redis } from '../index';
import { PublicKey } from '@solana/web3.js';

const CACHE_TTL = 60; // 1 minute for wallet data

// Validate Solana address
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function walletRoutes(app: FastifyInstance) {
  // GET /wallet/:address/earnings - Get wallet earnings breakdown
  app.get('/:address/earnings', {
    schema: {
      tags: ['wallet'],
      summary: 'Get wallet earnings breakdown',
      params: {
        type: 'object',
        properties: {
          address: { type: 'string' },
        },
        required: ['address'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            wallet: { type: 'string' },
            totalEarnedSol: { type: 'string' },
            totalEarnedToken: { type: 'string' },
            totalClaimedSol: { type: 'string' },
            totalClaimedToken: { type: 'string' },
            unclaimedSol: { type: 'string' },
            unclaimedToken: { type: 'string' },
            eligibleEpochs: { type: 'integer' },
            claimedEpochs: { type: 'integer' },
            epochBreakdown: { type: 'array' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Params: { address: string } }>, reply: FastifyReply) => {
    const { address } = request.params;

    if (!isValidSolanaAddress(address)) {
      return reply.status(400).send({ error: 'Invalid Solana address' });
    }

    // Check cache
    const cacheKey = `wallet:earnings:${address}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get all allocations for this wallet
    const allocations = await prisma.allocation.findMany({
      where: { wallet: address },
      include: {
        epoch: {
          select: {
            epochId: true,
            publishedAt: true,
          },
        },
      },
      orderBy: { epochId: 'desc' },
    });

    // Get all claims for this wallet
    const claims = await prisma.claim.findMany({
      where: { wallet: address },
      select: {
        epochId: true,
        claimedSol: true,
        claimedToken: true,
        claimedAt: true,
        claimSig: true,
      },
    });

    type ClaimData = typeof claims[number];
    const claimsMap = new Map<number, ClaimData>(claims.map(c => [Number(c.epochId), c]));

    // Calculate totals
    let totalEarnedSol = 0n;
    let totalEarnedToken = 0n;
    let totalClaimedSol = 0n;
    let totalClaimedToken = 0n;

    const epochBreakdown = allocations.map(a => {
      const claim = claimsMap.get(Number(a.epochId));
      totalEarnedSol += a.amountSol;
      totalEarnedToken += a.amountToken;
      
      if (claim) {
        totalClaimedSol += claim.claimedSol;
        totalClaimedToken += claim.claimedToken;
      }

      return {
        epochId: Number(a.epochId),
        earnedSol: a.amountSol.toString(),
        earnedToken: a.amountToken.toString(),
        claimed: !!claim,
        claimedSol: claim?.claimedSol.toString() || '0',
        claimedToken: claim?.claimedToken.toString() || '0',
        claimedAt: claim?.claimedAt?.toISOString() || null,
        claimSig: claim?.claimSig || null,
        publishedAt: a.epoch.publishedAt.toISOString(),
      };
    });

    const result = {
      wallet: address,
      totalEarnedSol: totalEarnedSol.toString(),
      totalEarnedToken: totalEarnedToken.toString(),
      totalClaimedSol: totalClaimedSol.toString(),
      totalClaimedToken: totalClaimedToken.toString(),
      unclaimedSol: (totalEarnedSol - totalClaimedSol).toString(),
      unclaimedToken: (totalEarnedToken - totalClaimedToken).toString(),
      eligibleEpochs: allocations.length,
      claimedEpochs: claims.length,
      epochBreakdown,
    };

    // Cache result
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));

    return result;
  });

  // GET /wallet/:address/claims - Get claim transaction history
  app.get('/:address/claims', {
    schema: {
      tags: ['wallet'],
      summary: 'Get wallet claim transaction history',
      params: {
        type: 'object',
        properties: {
          address: { type: 'string' },
        },
        required: ['address'],
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
          offset: { type: 'integer', default: 0, minimum: 0 },
        },
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: { address: string }; 
    Querystring: { limit?: number; offset?: number } 
  }>, reply: FastifyReply) => {
    const { address } = request.params;
    const limit = request.query.limit || 20;
    const offset = request.query.offset || 0;

    if (!isValidSolanaAddress(address)) {
      return reply.status(400).send({ error: 'Invalid Solana address' });
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where: { wallet: address },
        orderBy: { claimedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          epoch: {
            select: {
              epochId: true,
              rewardsSol: true,
            },
          },
        },
      }),
      prisma.claim.count({ where: { wallet: address } }),
    ]);

    return {
      wallet: address,
      claims: claims.map(c => ({
        epochId: Number(c.epochId),
        claimedSol: c.claimedSol.toString(),
        claimedToken: c.claimedToken.toString(),
        claimedAt: c.claimedAt.toISOString(),
        claimSig: c.claimSig,
        explorerUrl: `https://solscan.io/tx/${c.claimSig}`,
      })),
      total,
      hasMore: offset + limit < total,
    };
  });

  // GET /wallet/:address/unclaimed - Get unclaimed epochs for wallet
  app.get('/:address/unclaimed', {
    schema: {
      tags: ['wallet'],
      summary: 'Get unclaimed epochs for wallet',
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

    // Get allocations without claims
    const allocations = await prisma.allocation.findMany({
      where: { wallet: address },
      select: {
        epochId: true,
        amountSol: true,
        amountToken: true,
        proof: true,
        epoch: {
          select: {
            merkleRoot: true,
            publishedAt: true,
          },
        },
      },
    });

    const claims = await prisma.claim.findMany({
      where: { wallet: address },
      select: { epochId: true },
    });

    const claimedEpochs = new Set(claims.map(c => Number(c.epochId)));

    const unclaimed = allocations
      .filter(a => !claimedEpochs.has(Number(a.epochId)))
      .map(a => ({
        epochId: Number(a.epochId),
        amountSol: a.amountSol.toString(),
        amountToken: a.amountToken.toString(),
        proof: a.proof,
        merkleRoot: a.epoch.merkleRoot,
        publishedAt: a.epoch.publishedAt.toISOString(),
      }));

    const totalUnclaimedSol = unclaimed.reduce(
      (sum, u) => sum + BigInt(u.amountSol), 
      0n
    );
    const totalUnclaimedToken = unclaimed.reduce(
      (sum, u) => sum + BigInt(u.amountToken), 
      0n
    );

    return {
      wallet: address,
      unclaimedEpochs: unclaimed,
      totalUnclaimedSol: totalUnclaimedSol.toString(),
      totalUnclaimedToken: totalUnclaimedToken.toString(),
      count: unclaimed.length,
    };
  });
}


