import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma, redis } from '../index';

const CACHE_TTL = 30; // 30 seconds

interface MetricsResponse {
  price: string | null;
  liquidity: string;
  volume24h: string;
  totalDistributed: string;
  totalBurned: string;
  holderCount: number;
  currentEpoch: number;
  treasuryBalance: string;
  lastUpdated: string;
}

export async function metricsRoutes(app: FastifyInstance) {
  // GET /metrics - Live metrics for the flywheel
  app.get('/', {
    schema: {
      tags: ['metrics'],
      summary: 'Get live flywheel metrics',
      response: {
        200: {
          type: 'object',
          properties: {
            price: { type: 'string', nullable: true },
            liquidity: { type: 'string' },
            volume24h: { type: 'string' },
            totalDistributed: { type: 'string' },
            totalBurned: { type: 'string' },
            holderCount: { type: 'integer' },
            currentEpoch: { type: 'integer' },
            treasuryBalance: { type: 'string' },
            lastUpdated: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Try cache first
    const cached = await redis.get('metrics:latest');
    if (cached) {
      return JSON.parse(cached);
    }

    // Get latest snapshot
    const snapshot = await prisma.metricSnapshot.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    // Get current epoch
    const latestEpoch = await prisma.epoch.findFirst({
      orderBy: { epochId: 'desc' },
    });

    // Aggregate totals
    const totals = await prisma.epoch.aggregate({
      _sum: {
        rewardsSol: true,
        claimedSol: true,
      },
    });

    const metrics: MetricsResponse = {
      price: snapshot?.price?.toString() || null,
      liquidity: snapshot?.liquidity?.toString() || '0',
      volume24h: snapshot?.volume24h?.toString() || '0',
      totalDistributed: totals._sum.rewardsSol?.toString() || '0',
      totalBurned: snapshot?.totalBurned?.toString() || '0',
      holderCount: snapshot?.holderCount || 0,
      currentEpoch: latestEpoch?.epochId ? Number(latestEpoch.epochId) : 0,
      treasuryBalance: snapshot?.treasuryBalance?.toString() || '0',
      lastUpdated: snapshot?.timestamp?.toISOString() || new Date().toISOString(),
    };

    // Cache result
    await redis.setex('metrics:latest', CACHE_TTL, JSON.stringify(metrics));

    return metrics;
  });

  // GET /metrics/history - Historical metrics
  app.get('/history', {
    schema: {
      tags: ['metrics'],
      summary: 'Get historical metrics',
      querystring: {
        type: 'object',
        properties: {
          days: { type: 'integer', default: 7, minimum: 1, maximum: 90 },
        },
      },
    },
  }, async (request: FastifyRequest<{ Querystring: { days?: number } }>, reply: FastifyReply) => {
    const days = request.query.days || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const snapshots = await prisma.metricSnapshot.findMany({
      where: { timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
      select: {
        timestamp: true,
        price: true,
        liquidity: true,
        volume24h: true,
        totalDistributed: true,
        holderCount: true,
        treasuryBalance: true,
      },
    });

    return {
      period: `${days}d`,
      dataPoints: snapshots.map(s => ({
        timestamp: s.timestamp.toISOString(),
        price: s.price?.toString() || null,
        liquidity: s.liquidity?.toString() || '0',
        volume24h: s.volume24h?.toString() || '0',
        totalDistributed: s.totalDistributed?.toString() || '0',
        holderCount: s.holderCount || 0,
        treasuryBalance: s.treasuryBalance?.toString() || '0',
      })),
    };
  });
}

