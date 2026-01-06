import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../index';

export async function epochsRoutes(app: FastifyInstance) {
  // GET /epochs - List all epochs
  app.get('/', {
    schema: {
      tags: ['epochs'],
      summary: 'List all epochs',
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
          offset: { type: 'integer', default: 0, minimum: 0 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            epochs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  epochId: { type: 'integer' },
                  startSlot: { type: 'string' },
                  endSlot: { type: 'string' },
                  rewardsSol: { type: 'string' },
                  rewardsToken: { type: 'string' },
                  claimedSol: { type: 'string' },
                  claimedToken: { type: 'string' },
                  numClaimants: { type: 'integer' },
                  publishedAt: { type: 'string' },
                  publishSig: { type: 'string', nullable: true },
                },
              },
            },
            total: { type: 'integer' },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>, reply: FastifyReply) => {
    const limit = request.query.limit || 20;
    const offset = request.query.offset || 0;

    const [epochs, total] = await Promise.all([
      prisma.epoch.findMany({
        orderBy: { epochId: 'desc' },
        take: limit,
        skip: offset,
        select: {
          epochId: true,
          startSlot: true,
          endSlot: true,
          rewardsSol: true,
          rewardsToken: true,
          claimedSol: true,
          claimedToken: true,
          numClaimants: true,
          publishedAt: true,
          publishSig: true,
        },
      }),
      prisma.epoch.count(),
    ]);

    return {
      epochs: epochs.map(e => ({
        epochId: Number(e.epochId),
        startSlot: e.startSlot.toString(),
        endSlot: e.endSlot.toString(),
        rewardsSol: e.rewardsSol.toString(),
        rewardsToken: e.rewardsToken.toString(),
        claimedSol: e.claimedSol.toString(),
        claimedToken: e.claimedToken.toString(),
        numClaimants: e.numClaimants,
        publishedAt: e.publishedAt.toISOString(),
        publishSig: e.publishSig,
      })),
      total,
      hasMore: offset + limit < total,
    };
  });

  // GET /epochs/:id - Get single epoch details
  app.get('/:id', {
    schema: {
      tags: ['epochs'],
      summary: 'Get epoch details',
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
    },
  }, async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const epoch = await prisma.epoch.findUnique({
      where: { epochId: BigInt(request.params.id) },
      include: {
        _count: {
          select: {
            allocations: true,
            claims: true,
          },
        },
      },
    });

    if (!epoch) {
      return reply.status(404).send({ error: 'Epoch not found' });
    }

    return {
      epochId: Number(epoch.epochId),
      startSlot: epoch.startSlot.toString(),
      endSlot: epoch.endSlot.toString(),
      merkleRoot: epoch.merkleRoot,
      rewardsSol: epoch.rewardsSol.toString(),
      rewardsToken: epoch.rewardsToken.toString(),
      claimedSol: epoch.claimedSol.toString(),
      claimedToken: epoch.claimedToken.toString(),
      numClaimants: epoch.numClaimants,
      totalAllocations: epoch._count.allocations,
      totalClaims: epoch._count.claims,
      publishedAt: epoch.publishedAt.toISOString(),
      publishSig: epoch.publishSig,
      csvHash: epoch.csvHash,
      claimProgress: epoch.rewardsSol > 0n 
        ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol) * 100).toFixed(2)
        : '0',
    };
  });

  // GET /epochs/:id/allocations - Get all allocations for an epoch
  app.get('/:id/allocations', {
    schema: {
      tags: ['epochs'],
      summary: 'Get epoch allocations (for transparency)',
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', default: 100, minimum: 1, maximum: 1000 },
          offset: { type: 'integer', default: 0, minimum: 0 },
        },
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: { id: number }; 
    Querystring: { limit?: number; offset?: number } 
  }>, reply: FastifyReply) => {
    const limit = request.query.limit || 100;
    const offset = request.query.offset || 0;

    const [allocations, total] = await Promise.all([
      prisma.allocation.findMany({
        where: { epochId: BigInt(request.params.id) },
        orderBy: { amountSol: 'desc' },
        take: limit,
        skip: offset,
        select: {
          wallet: true,
          amountSol: true,
          amountToken: true,
          leafHash: true,
        },
      }),
      prisma.allocation.count({
        where: { epochId: BigInt(request.params.id) },
      }),
    ]);

    return {
      epochId: request.params.id,
      allocations: allocations.map(a => ({
        wallet: a.wallet,
        amountSol: a.amountSol.toString(),
        amountToken: a.amountToken.toString(),
        leafHash: a.leafHash,
      })),
      total,
      hasMore: offset + limit < total,
    };
  });

  // GET /epochs/current - Get current epoch info
  app.get('/current', {
    schema: {
      tags: ['epochs'],
      summary: 'Get current epoch info and estimated next epoch',
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const current = await prisma.epoch.findFirst({
      orderBy: { epochId: 'desc' },
    });

    if (!current) {
      return {
        currentEpoch: null,
        nextEpochEstimate: null,
      };
    }

    // Estimate next epoch (e.g., every 24 hours)
    const epochDuration = 24 * 60 * 60 * 1000; // 24h in ms
    const nextEpochEstimate = new Date(current.publishedAt.getTime() + epochDuration);

    return {
      currentEpoch: {
        epochId: Number(current.epochId),
        publishedAt: current.publishedAt.toISOString(),
        rewardsSol: current.rewardsSol.toString(),
        claimedSol: current.claimedSol.toString(),
      },
      nextEpochEstimate: nextEpochEstimate.toISOString(),
      timeUntilNextEpoch: Math.max(0, nextEpochEstimate.getTime() - Date.now()),
    };
  });
}

