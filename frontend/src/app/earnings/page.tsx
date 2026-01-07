'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { 
  Wallet, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated data
const mockEarnings = {
  totalEarnedSol: '12.847',
  claimedSol: '10.234',
  unclaimedSol: '2.613',
  currentEpoch: 127,
  lastEpochPublished: '2024-01-07T14:30:00Z',
  eligibleEpochs: 45,
  claimedEpochs: 42,
};

const mockEpochHistory = [
  { id: 127, amount: '0.892', status: 'unclaimed', publishedAt: '2024-01-07T14:30:00Z', merkleRoot: '8x7f...' },
  { id: 126, amount: '0.956', status: 'unclaimed', publishedAt: '2024-01-05T14:30:00Z', merkleRoot: '9a2b...' },
  { id: 125, amount: '0.765', status: 'unclaimed', publishedAt: '2024-01-03T14:30:00Z', merkleRoot: '7c4d...' },
  { id: 124, amount: '0.834', status: 'claimed', publishedAt: '2024-01-01T14:30:00Z', merkleRoot: '6e5f...' },
  { id: 123, amount: '0.712', status: 'claimed', publishedAt: '2023-12-30T14:30:00Z', merkleRoot: '5g6h...' },
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

function AnimatedNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState('0');
  
  useEffect(() => {
    const numValue = parseFloat(value);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentValue = numValue * eased;
      setDisplayed(currentValue.toFixed(3));
      
      if (current >= steps) {
        clearInterval(timer);
        setDisplayed(value);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{displayed}{suffix}</>;
}

function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '',
  trend,
  highlight = false 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  suffix?: string;
  trend?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'card',
        highlight && 'border-accent/30 bg-accent-muted/20'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          highlight ? 'bg-accent/20' : 'bg-background-hover'
        )}>
          <Icon className={cn('w-5 h-5', highlight ? 'text-accent' : 'text-foreground-muted')} />
        </div>
        {trend && (
          <span className="badge-success text-xs">{trend}</span>
        )}
      </div>
      <p className="text-body-sm text-foreground-muted mb-1">{label}</p>
      <p className={cn('text-2xl font-semibold', highlight && 'text-accent')}>
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
    </motion.div>
  );
}

function EpochRow({ epoch, index }: { epoch: typeof mockEpochHistory[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      variants={fadeInUp}
      className="border-b border-border-subtle last:border-0"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 py-4 px-4 hover:bg-background-hover transition-colors text-left"
      >
        <ChevronRight className={cn(
          'w-4 h-4 text-foreground-muted transition-transform',
          expanded && 'rotate-90'
        )} />
        
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2">
            <span className="font-mono text-foreground">#{epoch.id}</span>
          </div>
          <div className="col-span-3">
            <span className="font-semibold">{epoch.amount} SOL</span>
          </div>
          <div className="col-span-4">
            <span className="text-foreground-secondary text-sm">
              {new Date(epoch.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="col-span-3 flex justify-end">
            {epoch.status === 'claimed' ? (
              <span className="badge-success">
                <CheckCircle2 className="w-3 h-3" />
                Claimed
              </span>
            ) : (
              <span className="badge-accent">
                <Clock className="w-3 h-3" />
                Unclaimed
              </span>
            )}
          </div>
        </div>
      </button>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 ml-8"
        >
          <div className="bg-background-tertiary rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-foreground-muted mb-1">Merkle Root</p>
                <p className="font-mono text-foreground">{epoch.merkleRoot}</p>
              </div>
              <div>
                <p className="text-foreground-muted mb-1">Published</p>
                <p className="text-foreground">
                  {new Date(epoch.publishedAt).toISOString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <a
                href={`/epoch/${epoch.id}`}
                className="btn-secondary btn-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Details
              </a>
              <button className="btn-ghost btn-sm">
                <Download className="w-4 h-4" />
                Download Proof
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ClaimPanel({ unclaimedAmount }: { unclaimedAmount: string }) {
  const [claiming, setClaiming] = useState(false);
  
  const handleClaim = async () => {
    setClaiming(true);
    // Simulate claim
    await new Promise(resolve => setTimeout(resolve, 2000));
    setClaiming(false);
  };
  
  return (
    <motion.div
      variants={fadeInUp}
      className="card border-accent/30 bg-gradient-to-br from-accent-muted/30 to-transparent"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent font-medium">Rewards Available</span>
          </div>
          <p className="text-3xl font-semibold mb-1">{unclaimedAmount} SOL</p>
          <p className="text-foreground-muted">from 3 unclaimed epochs</p>
        </div>
        
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="btn-primary btn-lg w-full md:w-auto"
        >
          {claiming ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Claiming...
            </>
          ) : (
            <>
              Claim All Rewards
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  const { setVisible } = useWalletModal();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-16 h-16 rounded-full bg-background-hover flex items-center justify-center mx-auto mb-6">
        <Wallet className="w-8 h-8 text-foreground-muted" />
      </div>
      <h2 className="text-h2 mb-3">Connect your wallet</h2>
      <p className="text-foreground-secondary mb-8 max-w-md mx-auto">
        Connect your Solana wallet to view your earnings and claim rewards from eligible epochs.
      </p>
      <button onClick={() => setVisible(true)} className="btn-primary btn-lg">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton w-10 h-10 rounded-lg mb-4" />
            <div className="skeleton h-4 w-24 mb-2" />
            <div className="skeleton h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-6 w-48 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-border-subtle last:border-0">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EarningsPage() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [searchAddress, setSearchAddress] = useState('');
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
              <h1 className="text-h1 mb-1">Earnings Dashboard</h1>
              <p className="text-foreground-secondary">
                Track your rewards and claim your SOL
              </p>
            </div>
            
            {/* Search bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="input input-with-icon"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8">
        {!connected && !searchAddress ? (
          <EmptyState />
        ) : loading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                icon={TrendingUp}
                label="Total Earned"
                value={mockEarnings.totalEarnedSol}
                suffix=" SOL"
              />
              <KPICard
                icon={CheckCircle2}
                label="Claimed"
                value={mockEarnings.claimedSol}
                suffix=" SOL"
              />
              <KPICard
                icon={Clock}
                label="Unclaimed"
                value={mockEarnings.unclaimedSol}
                suffix=" SOL"
                highlight
              />
              <KPICard
                icon={AlertCircle}
                label="Current Epoch"
                value={mockEarnings.currentEpoch.toString()}
                suffix=""
                trend="+3 since last visit"
              />
            </div>

            {/* Claim Panel */}
            {parseFloat(mockEarnings.unclaimedSol) > 0 && (
              <ClaimPanel unclaimedAmount={mockEarnings.unclaimedSol} />
            )}

            {/* Epoch History Table */}
            <motion.div variants={fadeInUp} className="card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-h3">Epoch History</h2>
                <button className="btn-ghost btn-sm">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              
              {/* Table Header */}
              <div className="px-6 py-3 bg-background-tertiary border-b border-border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-4" />
                  <div className="flex-1 grid grid-cols-12 gap-4 text-caption font-medium text-foreground-muted uppercase tracking-wider">
                    <div className="col-span-2">Epoch</div>
                    <div className="col-span-3">Amount</div>
                    <div className="col-span-4">Published</div>
                    <div className="col-span-3 text-right">Status</div>
                  </div>
                </div>
              </div>
              
              {/* Table Body */}
              <div>
                {mockEpochHistory.map((epoch, i) => (
                  <EpochRow key={epoch.id} epoch={epoch} index={i} />
                ))}
              </div>
              
              {/* Load More */}
              <div className="px-6 py-4 border-t border-border text-center">
                <button className="btn-ghost btn-sm">
                  Load more epochs
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
