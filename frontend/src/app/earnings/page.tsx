'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, Wallet, ArrowRight, HelpCircle } from 'lucide-react';
import { useWalletEarnings } from '@/hooks/useWalletEarnings';
import { WalletButton } from '@/components/wallet-button';
import { ClaimStepper } from '@/components/claim-stepper';
import { EpochBreakdown, ClaimHistory } from '@/components/epoch-breakdown';
import { Tooltip, tooltipContent } from '@/components/tooltip';
import { formatSol, formatNumber, shortenAddress, cn } from '@/lib/utils';

type Tab = 'overview' | 'epochs' | 'claims' | 'activity';

export default function EarningsPage() {
  const { publicKey, connected } = useWallet();
  const [inputAddress, setInputAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const walletAddress = connected ? publicKey?.toBase58() : searchAddress;
  const { data: earnings, isLoading, error, refetch } = useWalletEarnings(walletAddress || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAddress(inputAddress);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'epochs', label: 'Epochs' },
    { key: 'claims', label: 'Claims' },
    { key: 'activity', label: 'Activity' },
  ];

  const hasUnclaimed = earnings && BigInt(earnings.unclaimedSol) > BigInt(0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border-default">
        <div className="container-main py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-heading font-semibold text-text-primary mb-2">
                Dashboard
              </h1>
              <p className="text-body text-text-secondary">
                Track rewards, view epochs, and claim your SOL.
              </p>
            </div>

            {/* Wallet Input */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Enter wallet address..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="input pl-9"
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
              <div className="flex items-center gap-2">
                <span className="text-caption text-text-muted">or</span>
                <WalletButton />
              </div>
            </div>
          </div>

          {walletAddress && (
            <div className="mt-4 flex items-center gap-2 text-caption text-text-muted">
              <Wallet className="w-4 h-4" />
              <span>Viewing:</span>
              <code className="mono">{shortenAddress(walletAddress)}</code>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      {walletAddress ? (
        <div className="container-main py-8">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error as Error} />
          ) : earnings ? (
            <>
              {/* KPI Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="kpi-card">
                  <div className="kpi-value">{formatSol(earnings.totalEarnedSol)}</div>
                  <div className="kpi-label">Total Earned (SOL)</div>
                  {earnings.totalEarnedToken !== '0' && (
                    <div className="text-caption text-text-muted mt-1">
                      + {formatNumber(earnings.totalEarnedToken)} tokens
                    </div>
                  )}
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{formatSol(earnings.totalClaimedSol)}</div>
                  <div className="kpi-label">Claimed (SOL)</div>
                  <div className="text-caption text-text-muted mt-1">
                    {earnings.claimedEpochs} of {earnings.eligibleEpochs} epochs
                  </div>
                </div>
                <div className={cn('kpi-card', hasUnclaimed && 'border-accent-warning/30')}>
                  <div className={cn('kpi-value', hasUnclaimed && 'text-accent-warning')}>
                    {formatSol(earnings.unclaimedSol)}
                  </div>
                  <div className="kpi-label">Unclaimed (SOL)</div>
                  <div className="text-caption text-text-muted mt-1">
                    {earnings.eligibleEpochs - earnings.claimedEpochs} epochs pending
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn('tab', activeTab === tab.key && 'tab-active')}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="animate-fade-in">
                {activeTab === 'overview' && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Claim Panel */}
                    <div className="lg:col-span-1">
                      {hasUnclaimed ? (
                        <ClaimStepper
                          wallet={walletAddress}
                          unclaimedSol={earnings.unclaimedSol}
                          unclaimedEpochs={earnings.eligibleEpochs - earnings.claimedEpochs}
                          onComplete={() => refetch()}
                        />
                      ) : (
                        <div className="card">
                          <h3 className="text-body font-semibold mb-2">No pending claims</h3>
                          <p className="text-caption text-text-muted">
                            All available rewards have been claimed. New rewards will appear after the next epoch.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Recent Epochs */}
                    <div className="lg:col-span-2">
                      <div className="card">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-body font-semibold">Recent Epochs</h3>
                          <button 
                            onClick={() => setActiveTab('epochs')}
                            className="btn-ghost btn-sm"
                          >
                            View all
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                        <EpochBreakdown epochs={earnings.epochBreakdown.slice(0, 5)} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'epochs' && (
                  <div className="card">
                    <h3 className="text-body font-semibold mb-4">All Epochs</h3>
                    <EpochBreakdown epochs={earnings.epochBreakdown} />
                  </div>
                )}

                {activeTab === 'claims' && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card lg:col-span-1">
                      {hasUnclaimed ? (
                        <ClaimStepper
                          wallet={walletAddress}
                          unclaimedSol={earnings.unclaimedSol}
                          unclaimedEpochs={earnings.eligibleEpochs - earnings.claimedEpochs}
                          onComplete={() => refetch()}
                        />
                      ) : (
                        <>
                          <h3 className="text-body font-semibold mb-2">All caught up</h3>
                          <p className="text-caption text-text-muted">
                            No pending claims. Check back after the next epoch.
                          </p>
                        </>
                      )}
                    </div>
                    <div className="card lg:col-span-1">
                      <h3 className="text-body font-semibold mb-4">Claim Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-border-default">
                          <span className="text-text-secondary">Total claimed</span>
                          <span className="font-medium">{formatSol(earnings.totalClaimedSol)} SOL</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border-default">
                          <span className="text-text-secondary">Epochs claimed</span>
                          <span className="font-medium">{earnings.claimedEpochs}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-text-secondary">Pending</span>
                          <span className="font-medium text-accent-warning">
                            {formatSol(earnings.unclaimedSol)} SOL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="card">
                    <h3 className="text-body font-semibold mb-4">Claim History</h3>
                    <ClaimHistory 
                      claims={earnings.epochBreakdown
                        .filter((e) => e.claimed && e.claimSig)
                        .map((e) => ({
                          epochId: e.epochId,
                          amount: e.claimedSol,
                          signature: e.claimSig!,
                          timestamp: e.claimedAt || '',
                        }))}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState variant="no-data" />
          )}
        </div>
      ) : (
        <div className="container-main py-16">
          <EmptyState variant="no-wallet" />
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-12">
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton h-9 w-24 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="card text-center py-12 max-w-md mx-auto">
      <h3 className="text-body font-semibold mb-2">Unable to load data</h3>
      <p className="text-caption text-text-muted mb-4">
        {error.message || 'Something went wrong. Please try again.'}
      </p>
      <button onClick={() => window.location.reload()} className="btn-secondary btn-sm">
        Retry
      </button>
    </div>
  );
}

function EmptyState({ variant }: { variant: 'no-wallet' | 'no-data' }) {
  return (
    <div className="card text-center py-12 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center mx-auto mb-4">
        {variant === 'no-wallet' ? (
          <Search className="w-5 h-5 text-text-muted" />
        ) : (
          <Wallet className="w-5 h-5 text-text-muted" />
        )}
      </div>
      <h3 className="text-body font-semibold mb-2">
        {variant === 'no-wallet' ? 'Enter a wallet address' : 'No earnings found'}
      </h3>
      <p className="text-caption text-text-muted">
        {variant === 'no-wallet'
          ? 'Connect your wallet or search any Solana address to view earnings.'
          : 'This wallet has no earnings history yet.'}
      </p>
    </div>
  );
}
