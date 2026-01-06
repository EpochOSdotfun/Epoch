import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma, redis } from '../index';

export async function healthRoutes(app: FastifyInstance) {
  // GET /health - Basic health check
  app.get('/', {
    schema: {
      tags: ['health'],
      summary: 'Basic health check',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  // GET /health/ready - Readiness check (all dependencies)
  app.get('/ready', {
    schema: {
      tags: ['health'],
      summary: 'Readiness check with dependency status',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            checks: { type: 'object' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

    // Check database
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'ok', latency: Date.now() - dbStart };
    } catch (err: any) {
      checks.database = { status: 'error', error: err.message };
    }

    // Check Redis
    const redisStart = Date.now();
    try {
      await redis.ping();
      checks.redis = { status: 'ok', latency: Date.now() - redisStart };
    } catch (err: any) {
      checks.redis = { status: 'error', error: err.message };
    }

    const allHealthy = Object.values(checks).every(c => c.status === 'ok');

    if (!allHealthy) {
      reply.status(503);
    }

    return {
      status: allHealthy ? 'ready' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    };
  });

  // GET /health/live - Liveness check
  app.get('/live', {
    schema: {
      tags: ['health'],
      summary: 'Liveness check',
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return {
      status: 'alive',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  });
}

