import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import pino from 'pino';
import 'dotenv/config';

import { metricsRoutes } from './routes/metrics';
import { epochsRoutes } from './routes/epochs';
import { walletRoutes } from './routes/wallet';
import { proofRoutes } from './routes/proof';
import { adminRoutes } from './routes/admin';
import { healthRoutes } from './routes/health';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' } 
    : undefined,
});

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const app = Fastify({
  logger: true,
});

async function buildServer() {
  // Security
  await app.register(helmet);
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // API Documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'SOL Flywheel API',
        description: 'API for the SOL Flywheel rewards distribution system',
        version: '1.0.0',
      },
      servers: [
        { url: process.env.API_URL || 'http://localhost:4000' },
      ],
      tags: [
        { name: 'metrics', description: 'Live metrics endpoints' },
        { name: 'epochs', description: 'Epoch data endpoints' },
        { name: 'wallet', description: 'Wallet earnings and claims' },
        { name: 'proof', description: 'Merkle proof endpoints' },
        { name: 'admin', description: 'Admin endpoints (protected)' },
      ],
    },
  });
  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Decorate with prisma and redis
  app.decorate('prisma', prisma);
  app.decorate('redis', redis);

  // Routes
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(metricsRoutes, { prefix: '/api/v1/metrics' });
  await app.register(epochsRoutes, { prefix: '/api/v1/epochs' });
  await app.register(walletRoutes, { prefix: '/api/v1/wallet' });
  await app.register(proofRoutes, { prefix: '/api/v1/proof' });
  await app.register(adminRoutes, { prefix: '/api/v1/admin' });

  return app;
}

async function start() {
  try {
    const server = await buildServer();
    
    const port = parseInt(process.env.PORT || '4000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    
    logger.info(`Server running at http://${host}:${port}`);
    logger.info(`API docs at http://${host}:${port}/docs`);

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down...');
      await server.close();
      await prisma.$disconnect();
      redis.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();


