'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Activity,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated metrics
const mockMetrics = {
  totalDistributed: '847.234',
  totalHolders: '2,341',
  totalEpochs: 127,
  avgPerEpoch: '6.67',
};

const mockEpochs = [
  {
    id: 127,
    totalDistributed: '8.234',
    holders: 245,
    publishedAt: '2024-01-07T14:30:00Z',
    status: 'active',
    merkleRoot: '8x7f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d',
    claimRate: 78,
  },
  {
    id: 126,
    totalDistributed: '7.891',
    holders: 238,
    publishedAt: '2024-01-05T14:30:00Z',
    status: 'active',
    merkleRoot: '9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    claimRate: 84,
  },
  {
    id: 125,
    totalDistributed: '6.543',
    holders: 231,
    publishedAt: '2024-01-03T14:30:00Z',
    status: 'completed',
    merkleRoot: '7c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h',
    claimRate: 96,
  },
  {
    id: 124,
    totalDistributed: '7.123',
    holders: 228,
    publishedAt: '2024-01-01T14:30:00Z',
    status: 'completed',
    merkleRoot: '6e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j',
    claimRate: 98,
  },
  {
    id: 123,
    totalDistributed: '5.987',
    holders: 221,
    publishedAt: '2023-12-30T14:30:00Z',
    status: 'completed',
    merkleRoot: '5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l',
    claimRate: 99,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

function MetricCard({ icon: Icon, label, value, suffix = '' }: { 
  icon: any; 
  label: string; 
  value: string; 
  suffix?: string;
}) {
  return (
    <motion.div variants={fadeInUp} className="card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-background-hover flex items-center justify-center">
          <Icon className="w-4 h-4 text-foreground-muted" />
        </div>
        <span className="text-body-sm text-foreground-muted">{label}</span>
      </div>
      <p className="text-2xl font-semibold">
        {value}<span className="text-foreground-muted">{suffix}</span>
      </p>
    </motion.div>
  );
}

function EpochCard({ epoch }: { epoch: typeof mockEpochs[0] }) {
  return (
    <motion.div variants={fadeInUp}>
      <Link
        href={`/epoch/${epoch.id}`}
        className="card-interactive block group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center font-mono font-semibold',
              epoch.status === 'active'
                ? 'bg-accent-muted text-accent'
                : 'bg-background-hover text-foreground-muted'
            )}>
              {epoch.id}
            </div>
            <div>
              <h3 className="font-semibold">Epoch #{epoch.id}</h3>
              <p className="text-caption text-foreground-muted">
                {new Date(epoch.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          {epoch.status === 'active' && (
            <span className="badge-accent">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Active
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-caption text-foreground-muted">Distributed</p>
            <p className="font-semibold">{epoch.totalDistributed} SOL</p>
          </div>
          <div>
            <p className="text-caption text-foreground-muted">Holders</p>
            <p className="font-semibold">{epoch.holders}</p>
          </div>
          <div>
            <p className="text-caption text-foreground-muted">Claimed</p>
            <p className="font-semibold">{epoch.claimRate}%</p>
          </div>
        </div>

        {/* Claim Progress */}
        <div className="relative h-1.5 bg-background-hover rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${epoch.claimRate}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute h-full bg-accent rounded-full"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="font-mono text-foreground-muted truncate max-w-[200px]">
            {epoch.merkleRoot.slice(0, 16)}...
          </div>
          <span className="flex items-center gap-1 text-foreground-muted group-hover:text-accent transition-colors">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function EpochsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredEpochs = mockEpochs.filter(epoch => {
    if (filter === 'all') return true;
    return epoch.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary/50">
        <div className="container-wide py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <h1 className="text-h1 mb-1">Live Metrics</h1>
              <p className="text-foreground-secondary">
                Real-time overview of epoch distributions and protocol health
              </p>
            </div>
            
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton w-8 h-8 rounded-lg mb-3" />
                  <div className="skeleton h-4 w-24 mb-2" />
                  <div className="skeleton h-8 w-32" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="flex gap-3 mb-4">
                    <div className="skeleton w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <div className="skeleton h-5 w-24 mb-2" />
                      <div className="skeleton h-3 w-16" />
                    </div>
                  </div>
                  <div className="skeleton h-16 w-full mb-4 rounded" />
                  <div className="skeleton h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-8"
          >
            {/* Protocol Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                icon={TrendingUp}
                label="Total Distributed"
                value={mockMetrics.totalDistributed}
                suffix=" SOL"
              />
              <MetricCard
                icon={Users}
                label="Total Holders"
                value={mockMetrics.totalHolders}
              />
              <MetricCard
                icon={Activity}
                label="Total Epochs"
                value={mockMetrics.totalEpochs.toString()}
              />
              <MetricCard
                icon={Clock}
                label="Avg Per Epoch"
                value={mockMetrics.avgPerEpoch}
                suffix=" SOL"
              />
            </div>

            {/* Filter */}
            <motion.div variants={fadeInUp} className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-foreground-muted" />
              <div className="flex gap-1 bg-background-secondary p-1 rounded-lg">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                      filter === f
                        ? 'bg-background-hover text-foreground'
                        : 'text-foreground-muted hover:text-foreground'
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Epochs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEpochs.map((epoch) => (
                <EpochCard key={epoch.id} epoch={epoch} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
