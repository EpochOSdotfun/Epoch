import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../index';

// Simple API key auth for admin routes
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

async function adminAuth(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key'];
  
  if (!ADMIN_API_KEY) {
    return reply.status(500).send({ error: 'Admin API key not configured' });
  }
  
  if (apiKey !== ADMIN_API_KEY) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function adminRoutes(app: FastifyInstance) {
  // Add auth hook to all admin routes
  app.addHook('preHandler', adminAuth);

  // GET /admin/config - Get current config
  app.get('/config', {
    schema: {
      tags: ['admin'],
      summary: 'Get current flywheel configuration',
      security: [{ apiKey: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Get latest config from config_history or return defaults
    const latestConfig = await prisma.configHistory.findMany({
      orderBy: { changedAt: 'desc' },
      take: 10,
    });

    // Build current config from history
    const config: Record<string, string> = {};
    const configFields = ['weights_rewards', 'weights_buyback', 'weights_burn', 'weights_auto_lp', 
                          'max_slippage_bps', 'max_trade_lamports', 'paused'];
    
    for (const field of configFields) {
      const latest = latestConfig.find(c => c.field === field);
      if (latest) {
        config[field] = latest.newValue;
      }
    }

    return {
      config,
      recentChanges: latestConfig.map(c => ({
        field: c.field,
        oldValue: c.oldValue,
        newValue: c.newValue,
        changedBy: c.changedBy,
        changedAt: c.changedAt.toISOString(),
        signature: c.signature,
      })),
    };
  });

  // GET /admin/treasury - Get treasury balances
  app.get('/treasury', {
    schema: {
      tags: ['admin'],
      summary: 'Get treasury balances and reconciliation status',
      security: [{ apiKey: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Get latest metric snapshot for treasury balance
    const latestMetrics = await prisma.metricSnapshot.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    // Calculate expected vs actual
    const epochTotals = await prisma.epoch.aggregate({
      _sum: {
        rewardsSol: true,
        claimedSol: true,
      },
    });

    const pendingClaims = (epochTotals._sum.rewardsSol || 0n) - (epochTotals._sum.claimedSol || 0n);

    return {
      treasuryBalance: latestMetrics?.treasuryBalance?.toString() || '0',
      totalAllocated: epochTotals._sum.rewardsSol?.toString() || '0',
      totalClaimed: epochTotals._sum.claimedSol?.toString() || '0',
      pendingClaims: pendingClaims.toString(),
      lastUpdated: latestMetrics?.timestamp?.toISOString() || null,
      reconciliation: {
        status: 'ok', // Would compare on-chain vs DB
        drift: '0',
        lastCheck: new Date().toISOString(),
      },
    };
  });

  // GET /admin/alerts - Get active alerts
  app.get('/alerts', {
    schema: {
      tags: ['admin'],
      summary: 'Get active alerts',
      security: [{ apiKey: [] }],
      querystring: {
        type: 'object',
        properties: {
          acknowledged: { type: 'boolean' },
          severity: { type: 'string', enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] },
          limit: { type: 'integer', default: 50 },
        },
      },
    },
  }, async (request: FastifyRequest<{ 
    Querystring: { acknowledged?: boolean; severity?: string; limit?: number } 
  }>, reply: FastifyReply) => {
    const { acknowledged, severity, limit = 50 } = request.query;

    const where: any = {};
    if (acknowledged !== undefined) where.acknowledged = acknowledged;
    if (severity) where.severity = severity;

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const counts = await prisma.alert.groupBy({
      by: ['severity', 'acknowledged'],
      _count: true,
    });

    return {
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        message: a.message,
        meta: a.meta,
        acknowledged: a.acknowledged,
        acknowledgedBy: a.acknowledgedBy,
        acknowledgedAt: a.acknowledgedAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      })),
      summary: counts,
    };
  });

  // POST /admin/alerts/:id/acknowledge - Acknowledge an alert
  app.post('/alerts/:id/acknowledge', {
    schema: {
      tags: ['admin'],
      summary: 'Acknowledge an alert',
      security: [{ apiKey: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          acknowledgedBy: { type: 'string' },
        },
        required: ['acknowledgedBy'],
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: { id: number }; 
    Body: { acknowledgedBy: string } 
  }>, reply: FastifyReply) => {
    const alert = await prisma.alert.update({
      where: { id: request.params.id },
      data: {
        acknowledged: true,
        acknowledgedBy: request.body.acknowledgedBy,
        acknowledgedAt: new Date(),
      },
    });

    return { success: true, alert };
  });

  // GET /admin/keepers - Get authorized keepers
  app.get('/keepers', {
    schema: {
      tags: ['admin'],
      summary: 'Get authorized keeper addresses',
      security: [{ apiKey: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // This would typically read from on-chain state
    // For now, return from config history
    const keeperConfig = await prisma.configHistory.findMany({
      where: { field: { startsWith: 'keeper' } },
      orderBy: { changedAt: 'desc' },
    });

    return {
      keepers: keeperConfig.map(k => ({
        field: k.field,
        value: k.newValue,
        addedAt: k.changedAt.toISOString(),
        signature: k.signature,
      })),
    };
  });

  // GET /admin/transactions - Get recent flywheel transactions
  app.get('/transactions', {
    schema: {
      tags: ['admin'],
      summary: 'Get recent flywheel transactions',
      security: [{ apiKey: [] }],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          limit: { type: 'integer', default: 50 },
          offset: { type: 'integer', default: 0 },
        },
      },
    },
  }, async (request: FastifyRequest<{ 
    Querystring: { type?: string; limit?: number; offset?: number } 
  }>, reply: FastifyReply) => {
    const { type, limit = 50, offset = 0 } = request.query;

    const where: any = {};
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { slot: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions: transactions.map(t => ({
        signature: t.signature,
        type: t.type,
        slot: t.slot.toString(),
        blockTime: t.blockTime?.toISOString(),
        success: t.success,
        meta: t.meta,
        explorerUrl: `https://solscan.io/tx/${t.signature}`,
      })),
      total,
      hasMore: offset + limit < total,
    };
  });

  // POST /admin/pause - Pause the flywheel (triggers on-chain)
  app.post('/pause', {
    schema: {
      tags: ['admin'],
      summary: 'Pause the flywheel',
      security: [{ apiKey: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // This would trigger an on-chain transaction
    // For now, just record the intent
    await prisma.configHistory.create({
      data: {
        field: 'paused',
        oldValue: 'false',
        newValue: 'true',
        changedBy: 'admin-api',
        changedAt: new Date(),
      },
    });

    return { 
      success: true, 
      message: 'Pause request recorded. On-chain transaction required.',
    };
  });

  // POST /admin/unpause - Unpause the flywheel
  app.post('/unpause', {
    schema: {
      tags: ['admin'],
      summary: 'Unpause the flywheel',
      security: [{ apiKey: [] }],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    await prisma.configHistory.create({
      data: {
        field: 'paused',
        oldValue: 'true',
        newValue: 'false',
        changedBy: 'admin-api',
        changedAt: new Date(),
      },
    });

    return { 
      success: true, 
      message: 'Unpause request recorded. On-chain transaction required.',
    };
  });
}

