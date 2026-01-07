'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, Wallet, CheckCircle, Clock, ArrowRight, ChevronRight, ExternalLink, Copy, Check } from 'lucide-react';
import { useWalletEarnings } from '@/hooks/useWalletEarnings';
import { WalletButton } from '@/components/wallet-button';
import { ClaimButton } from '@/components/claim-button';
import { formatSol, formatNumber, shortenAddress } from '@/lib/utils';

export default function EarningsPage() {
  const { connected, publicKey } = useWallet();
  const [searchAddress, setSearchAddress] = useState('');
  const [copied, setCopied] = useState(false);
  
  const walletAddress = searchAddress || (connected && publicKey ? publicKey.toBase58() : '');
  const { data: earnings, isLoading, error } = useWalletEarnings(walletAddress);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-default h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ink-900 rounded flex items-center justify-center">
                <span className="text-white font-semibold text-sm">E</span>
              </div>
              <span className="font-semibold text-ink-900">Epoch</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/epochs" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Epochs
              </Link>
              <Link href="/earnings" className="text-body-sm text-ink-900 font-medium">
                Earnings
              </Link>
            </nav>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="container-default py-12">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-title-lg text-ink-900 mb-2">Earnings Dashboard</h1>
          <p className="text-body text-ink-500">
            Track rewards, view epoch breakdown, and claim your SOL
          </p>
        </div>

        {/* Search Bar */}
        <div className="card-padded mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
              <input
                type="text"
                placeholder="Enter wallet address"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="input pl-10 font-mono text-mono"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
          
          {walletAddress && (
            <div className="mt-4 pt-4 border-t border-surface-100 flex items-center gap-3">
              <span className="text-caption text-ink-500">Viewing:</span>
              <code className="font-mono text-mono text-ink-700">{shortenAddress(walletAddress)}</code>
              <button onClick={copyAddress} className="btn-ghost btn-sm p-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-positive" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {walletAddress ? (
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
        ) : (
          <EmptyState type="no-wallet" />
        )}
      </main>
    </div>
  );
}

function EarningsContent({ earnings, walletAddress }: { earnings: any; walletAddress: string }) {
  const hasUnclaimed = Number(earnings.unclaimedSol) > 0;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-ink-500" />
            <span className="kpi-label mb-0">Total Earned</span>
          </div>
          <p className="kpi-value">{formatSol(earnings.totalEarnedSol)} SOL</p>
          {earnings.totalEarnedToken !== '0' && (
            <p className="kpi-sublabel">+ {formatNumber(earnings.totalEarnedToken)} tokens</p>
          )}
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-positive" />
            <span className="kpi-label mb-0">Claimed</span>
          </div>
          <p className="kpi-value">{formatSol(earnings.totalClaimedSol)} SOL</p>
          <p className="kpi-sublabel">{earnings.claimedEpochs} of {earnings.eligibleEpochs} epochs</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-warning" />
            <span className="kpi-label mb-0">Unclaimed</span>
          </div>
          <p className={`kpi-value ${hasUnclaimed ? 'text-accent' : ''}`}>
            {formatSol(earnings.unclaimedSol)} SOL
          </p>
          <p className="kpi-sublabel">{earnings.eligibleEpochs - earnings.claimedEpochs} epochs pending</p>
        </div>
      </div>

      {/* Claim Banner */}
      {hasUnclaimed && (
        <div className="card-padded border-accent/30 bg-accent-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-title-sm text-ink-900 mb-1">Rewards Available</h3>
              <p className="text-body-sm text-ink-500">
                {formatSol(earnings.unclaimedSol)} SOL from {earnings.eligibleEpochs - earnings.claimedEpochs} unclaimed epochs
              </p>
            </div>
            <button className="btn-accent">
              Claim All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Epoch Breakdown Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between">
          <h3 className="text-title-sm text-ink-900">Epoch Breakdown</h3>
          <Link href="/epochs" className="btn-ghost btn-sm">
            View all epochs
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        
        {earnings.epochBreakdown && earnings.epochBreakdown.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Epoch</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {earnings.epochBreakdown.map((epoch: any) => (
                <tr key={epoch.epochId}>
                  <td className="font-medium text-ink-900">#{epoch.epochId}</td>
                  <td className="mono-value">{formatSol(epoch.amount)} SOL</td>
                  <td>
                    {epoch.claimed ? (
                      <span className="badge-positive">Claimed</span>
                    ) : (
                      <span className="badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="text-ink-500">
                    {new Date(epoch.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="text-right">
                    <Link href={`/epoch/${epoch.epochId}`} className="btn-ghost btn-sm">
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-body-sm text-ink-500">No epoch data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-padded">
            <div className="skeleton h-4 w-24 mb-4" />
            <div className="skeleton h-8 w-32 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="card-padded">
        <div className="skeleton h-6 w-40 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-12 h-12 rounded-md bg-negative/10 flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="w-5 h-5 text-negative" />
      </div>
      <h3 className="text-title-sm text-ink-900 mb-2">Error Loading Data</h3>
      <p className="text-body-sm text-ink-500 max-w-sm mx-auto">
        {error.message || 'Unable to fetch earnings data. Please try again.'}
      </p>
    </div>
  );
}

function EmptyState({ type }: { type: 'no-wallet' | 'no-data' }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-12 h-12 rounded-md bg-surface-100 flex items-center justify-center mx-auto mb-4">
        {type === 'no-wallet' ? (
          <Search className="w-5 h-5 text-ink-500" />
        ) : (
          <Wallet className="w-5 h-5 text-ink-500" />
        )}
      </div>
      <h3 className="text-title-sm text-ink-900 mb-2">
        {type === 'no-wallet' ? 'Enter a Wallet Address' : 'No Earnings Found'}
      </h3>
      <p className="text-body-sm text-ink-500 max-w-sm mx-auto">
        {type === 'no-wallet'
          ? 'Connect your wallet or enter any Solana address to view earnings and claim history.'
          : 'This wallet has no recorded earnings. Hold tokens to become eligible for rewards.'}
      </p>
    </div>
  );
}
