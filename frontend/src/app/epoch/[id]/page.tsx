'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
  Hash,
  ExternalLink,
  Download,
  Copy,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated epoch data
const mockEpochDetail = {
  id: 127,
  totalDistributed: '8.234',
  holders: 245,
  publishedAt: '2024-01-07T14:30:00Z',
  status: 'active',
  merkleRoot: '8x7f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d',
  claimRate: 78,
  claimedAmount: '6.422',
  unclaimedAmount: '1.812',
  txSignature: '5h8g9f7e6d5c4b3a2z1y0x9w8v7u6t5s4r3q2p1o0n9m8l7k6j5i4h3g2f1e0d9c8b7a',
  feesClaimed: '12.456',
  swapExecuted: '11.892',
  routedToRewards: '8.234',
  routedToBuyback: '2.456',
  routedToBurn: '0.612',
  routedToAutoLP: '0.590',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-background-hover transition-colors"
    >
      {copied ? (
        <CheckCircle2 className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4 text-foreground-muted" />
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <motion.div variants={fadeInUp} className="card">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-foreground-muted" />}
        <span className="text-body-sm text-foreground-muted">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </motion.div>
  );
}

function FlowCard({ label, value, percentage, color }: { 
  label: string; 
  value: string; 
  percentage: number;
  color: 'accent' | 'success' | 'warning' | 'error';
}) {
  const colorClasses = {
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
  };

  return (
    <motion.div variants={fadeInUp} className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-body-sm text-foreground-muted">{label}</span>
        <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colorClasses[color])}>
          {percentage}%
        </span>
      </div>
      <p className="text-lg font-semibold">{value} SOL</p>
    </motion.div>
  );
}

export default function EpochDetailPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const epoch = mockEpochDetail;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-wide py-8">
          <div className="skeleton h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-4 w-24 mb-2" />
                <div className="skeleton h-6 w-32" />
              </div>
            ))}
          </div>
          <div className="card">
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary/50">
        <div className="container-wide py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back link */}
            <Link 
              href="/epochs" 
              className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Epochs
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-bold',
                  epoch.status === 'active'
                    ? 'bg-accent-muted text-accent'
                    : 'bg-background-hover text-foreground-muted'
                )}>
                  {epoch.id}
                </div>
                <div>
                  <h1 className="text-h1 mb-1">Epoch #{epoch.id}</h1>
                  <p className="text-foreground-secondary">
                    Published {new Date(epoch.publishedAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {epoch.status === 'active' && (
                <span className="badge-accent px-4 py-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Active Epoch
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="space-y-8"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Distributed" value={`${epoch.totalDistributed} SOL`} icon={TrendingUp} />
            <StatCard label="Eligible Holders" value={epoch.holders.toString()} icon={Users} />
            <StatCard label="Claim Rate" value={`${epoch.claimRate}%`} icon={CheckCircle2} />
            <StatCard label="Published" value={new Date(epoch.publishedAt).toLocaleDateString()} icon={Clock} />
          </div>

          {/* Transparency Details */}
          <motion.div variants={fadeInUp} className="card">
            <h2 className="text-h3 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-foreground-muted" />
              Transparency Details
            </h2>

            <div className="space-y-4">
              {/* Merkle Root */}
              <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                <div className="flex-1 mr-4">
                  <p className="text-body-sm text-foreground-muted mb-1">Merkle Root</p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {epoch.merkleRoot}
                  </p>
                </div>
                <CopyButton text={epoch.merkleRoot} />
              </div>

              {/* Transaction Signature */}
              <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                <div className="flex-1 mr-4">
                  <p className="text-body-sm text-foreground-muted mb-1">Publish Transaction</p>
                  <p className="font-mono text-sm text-foreground truncate">
                    {epoch.txSignature}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <CopyButton text={epoch.txSignature} />
                  <a
                    href={`https://solscan.io/tx/${epoch.txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-background-hover transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-foreground-muted" />
                  </a>
                </div>
              </div>

              {/* Download Proof */}
              <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
                <div>
                  <p className="text-body-sm text-foreground-muted mb-1">Epoch Proof File</p>
                  <p className="text-sm text-foreground">
                    Downloadable JSON with full merkle tree and allocations
                  </p>
                </div>
                <button className="btn-secondary btn-sm">
                  <Download className="w-4 h-4" />
                  Download Proof
                </button>
              </div>
            </div>
          </motion.div>

          {/* Fund Flow */}
          <motion.div variants={fadeInUp} className="card">
            <h2 className="text-h3 mb-6 flex items-center gap-2">
              <Hash className="w-5 h-5 text-foreground-muted" />
              Fund Flow Breakdown
            </h2>

            {/* Flow visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-background-tertiary rounded-xl">
                <p className="text-body-sm text-foreground-muted mb-2">Fees Collected</p>
                <p className="text-3xl font-semibold text-accent">{epoch.feesClaimed} SOL</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-foreground-muted">
                  <div className="w-2 h-2 bg-accent/50 rounded-full" />
                  From LP positions
                </div>
              </div>
              <div className="p-6 bg-background-tertiary rounded-xl">
                <p className="text-body-sm text-foreground-muted mb-2">After Swap</p>
                <p className="text-3xl font-semibold">{epoch.swapExecuted} SOL</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-foreground-muted">
                  <div className="w-2 h-2 bg-success/50 rounded-full" />
                  95.5% swap efficiency
                </div>
              </div>
            </div>

            {/* Distribution breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FlowCard 
                label="To Rewards" 
                value={epoch.routedToRewards} 
                percentage={69} 
                color="accent" 
              />
              <FlowCard 
                label="To Buyback" 
                value={epoch.routedToBuyback} 
                percentage={21} 
                color="success" 
              />
              <FlowCard 
                label="To Burn" 
                value={epoch.routedToBurn} 
                percentage={5} 
                color="warning" 
              />
              <FlowCard 
                label="To Auto-LP" 
                value={epoch.routedToAutoLP} 
                percentage={5} 
                color="error" 
              />
            </div>
          </motion.div>

          {/* Claim Progress */}
          <motion.div variants={fadeInUp} className="card">
            <h2 className="text-h3 mb-6">Claim Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-body-sm text-foreground-muted mb-1">Claimed</p>
                <p className="text-2xl font-semibold text-success">{epoch.claimedAmount} SOL</p>
              </div>
              <div>
                <p className="text-body-sm text-foreground-muted mb-1">Unclaimed</p>
                <p className="text-2xl font-semibold text-accent">{epoch.unclaimedAmount} SOL</p>
              </div>
              <div>
                <p className="text-body-sm text-foreground-muted mb-1">Total</p>
                <p className="text-2xl font-semibold">{epoch.totalDistributed} SOL</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-background-hover rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${epoch.claimRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute h-full bg-gradient-to-r from-accent to-success rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-foreground-muted">
              <span>0%</span>
              <span>{epoch.claimRate}% claimed</span>
              <span>100%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
