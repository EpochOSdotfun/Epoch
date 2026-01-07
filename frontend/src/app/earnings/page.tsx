'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Search, 
  Wallet, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useWalletEarnings } from '@/hooks/useWalletEarnings';
import { WalletButton } from '@/components/wallet-button';
import { ClaimButton } from '@/components/claim-button';
import { EpochBreakdown } from '@/components/epoch-breakdown';
import { formatSol, formatNumber, shortenAddress } from '@/lib/utils';
import { ShimmerCard, SpringChart, MiniSparkline } from '@/components/animations';

export default function EarningsPage() {
  const { publicKey, connected } = useWallet();
  const [inputAddress, setInputAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const walletAddress = connected ? publicKey?.toBase58() : searchAddress;
  const { data: earnings, isLoading, error } = useWalletEarnings(walletAddress || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAddress(inputAddress);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container-default">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-caption text-accent-primary uppercase tracking-wider mb-3">
            Dashboard
          </p>
          <h1 className="text-display-md mb-4">
            Your <span className="text-gradient">Earnings</span>
          </h1>
          <p className="text-body-lg text-text-secondary max-w-2xl">
            Track your rewards, view epoch breakdowns, and claim your SOL. 
            All data is verifiable on-chain.
          </p>
        </motion.div>

        {/* Wallet Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Enter wallet address..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="input pl-12"
                    disabled={connected}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={connected || !inputAddress}
                >
                  Search
                </button>
              </form>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-body-sm">or</span>
              <WalletButton />
            </div>
          </div>

          {connected && publicKey && (
            <div className="mt-4 flex items-center gap-2 text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-accent-primary" />
              <span className="text-body-sm">Connected: </span>
              <code className="text-accent-primary font-mono text-body-sm">
                {shortenAddress(publicKey.toBase58())}
              </code>
            </div>
          )}
        </motion.div>

        {/* Earnings Content */}
        {walletAddress && (
          <>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error as Error} />
            ) : earnings ? (
              <EarningsContent earnings={earnings} walletAddress={walletAddress} />
            ) : (
              <EmptyState type="no-data" />
            )}
          </>
        )}

        {/* Empty State - No Wallet */}
        {!walletAddress && <EmptyState type="no-wallet" />}
      </div>
    </div>
  );
}

// ============================================
// EARNINGS CONTENT
// ============================================
function EarningsContent({ earnings, walletAddress }: { earnings: any; walletAddress: string }) {
  // Mock sparkline data for demo
  const sparklineData = [4.2, 5.1, 4.8, 6.2, 5.5, 7.1, 6.3, 7.8, 6.9, 8.2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ShimmerCard delay={0}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-accent-muted">
              <TrendingUp className="w-5 h-5 text-accent-primary" />
            </div>
            <MiniSparkline data={sparklineData} className="opacity-60" />
          </div>
          <p className="text-caption text-text-muted uppercase tracking-wider mb-1">
            Total Earned
          </p>
          <p className="text-display-md font-display">
            {formatSol(earnings.totalEarnedSol)} <span className="text-text-muted text-body-lg">SOL</span>
          </p>
          {earnings.totalEarnedToken !== '0' && (
            <p className="text-body-sm text-text-secondary mt-1">
              + {formatNumber(earnings.totalEarnedToken)} tokens
            </p>
          )}
        </ShimmerCard>

        <ShimmerCard delay={100}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-accent-muted">
              <CheckCircle className="w-5 h-5 text-accent-primary" />
            </div>
            <span className="badge-neutral text-caption">
              {earnings.claimedEpochs} epochs
            </span>
          </div>
          <p className="text-caption text-text-muted uppercase tracking-wider mb-1">
            Claimed
          </p>
          <p className="text-display-md font-display">
            {formatSol(earnings.totalClaimedSol)} <span className="text-text-muted text-body-lg">SOL</span>
          </p>
        </ShimmerCard>

        <ShimmerCard delay={200} className="gradient-border">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-accent-primary/20">
              <Clock className="w-5 h-5 text-accent-primary" />
            </div>
            <span className="badge-accent text-caption">
              {earnings.eligibleEpochs - earnings.claimedEpochs} pending
            </span>
          </div>
          <p className="text-caption text-text-muted uppercase tracking-wider mb-1">
            Unclaimed
          </p>
          <p className="text-display-md font-display glow-text-subtle">
            {formatSol(earnings.unclaimedSol)} <span className="text-text-muted text-body-lg">SOL</span>
          </p>
        </ShimmerCard>
      </div>

      {/* Claim Section */}
      {Number(earnings.unclaimedSol) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-accent mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-heading-md mb-1">
                  Rewards Available
                </h3>
                <p className="text-body-md text-text-secondary">
                  {formatSol(earnings.unclaimedSol)} SOL from{' '}
                  {earnings.eligibleEpochs - earnings.claimedEpochs} unclaimed epochs
                </p>
              </div>
            </div>
            <ClaimButton
              wallet={walletAddress}
              unclaimedSol={earnings.unclaimedSol}
            />
          </div>
        </motion.div>
      )}

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-heading-md">Earnings History</h3>
            <p className="text-body-sm text-text-muted">Last 12 epochs</p>
          </div>
          <button className="btn-ghost btn-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <SpringChart
          data={[4.2, 5.1, 4.8, 6.2, 5.5, 7.1, 6.3, 7.8, 6.9, 8.2, 7.4, 8.9]}
          variant="area"
          height={200}
        />
      </motion.div>

      {/* Epoch Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-md">Epoch Breakdown</h3>
          <a href="/epochs" className="btn-ghost btn-sm">
            View All
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <EpochBreakdown epochs={earnings.epochBreakdown} />
      </motion.div>
    </motion.div>
  );
}

// ============================================
// LOADING STATE
// ============================================
function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated animate-pulse" />
              <div className="w-16 h-5 rounded bg-bg-elevated animate-pulse" />
            </div>
            <div className="w-24 h-3 rounded bg-bg-elevated animate-pulse mb-2" />
            <div className="w-32 h-8 rounded bg-bg-elevated animate-pulse" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="w-48 h-6 rounded bg-bg-elevated animate-pulse mb-6" />
        <div className="h-48 rounded bg-bg-elevated animate-pulse" />
      </div>
    </div>
  );
}

// ============================================
// ERROR STATE
// ============================================
function ErrorState({ error }: { error: Error }) {
  return (
    <div className="card text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-error/10 flex items-center justify-center">
        <ExternalLink className="w-8 h-8 text-accent-error" />
      </div>
      <h3 className="text-heading-md mb-2">Error Loading Data</h3>
      <p className="text-body-md text-text-secondary max-w-md mx-auto">
        {error.message || 'Unable to fetch earnings data. Please try again.'}
      </p>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ type }: { type: 'no-wallet' | 'no-data' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="card text-center py-16"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-bg-tertiary flex items-center justify-center">
        {type === 'no-wallet' ? (
          <Search className="w-8 h-8 text-text-muted" />
        ) : (
          <Wallet className="w-8 h-8 text-text-muted" />
        )}
      </div>
      <h3 className="text-heading-md mb-2">
        {type === 'no-wallet' ? 'Enter a Wallet Address' : 'No Earnings Found'}
      </h3>
      <p className="text-body-md text-text-secondary max-w-md mx-auto">
        {type === 'no-wallet'
          ? 'Connect your wallet or enter any Solana address to view earnings and claim history.'
          : 'This wallet has no recorded earnings. Hold tokens to become eligible for rewards.'}
      </p>
    </motion.div>
  );
}
