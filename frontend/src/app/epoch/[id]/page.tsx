'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Copy, Check, Users, Coins, Clock, FileText, Shield } from 'lucide-react';
import { useEpochDetails } from '@/hooks/useEpochDetails';
import { formatSol, formatNumber, shortenAddress } from '@/lib/utils';
import { useState } from 'react';

export default function EpochDetailPage() {
  const { id } = useParams();
  const epochId = Number(id);
  const { data: epoch, isLoading, error } = useEpochDetails(epochId);
  const [copiedRoot, setCopiedRoot] = useState(false);

  const copyMerkleRoot = () => {
    if (epoch?.merkleRoot) {
      navigator.clipboard.writeText(epoch.merkleRoot);
      setCopiedRoot(true);
      setTimeout(() => setCopiedRoot(false), 2000);
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
              <Link href="/epochs" className="text-body-sm text-ink-900 font-medium">
                Epochs
              </Link>
              <Link href="/earnings" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Earnings
              </Link>
            </nav>
          </div>
          <Link href="/earnings" className="btn-primary btn-sm">
            Check Earnings
          </Link>
        </div>
      </header>

      <main className="container-default py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/epochs" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            All Epochs
          </Link>
          <span className="text-ink-300">/</span>
          <span className="text-body-sm text-ink-900">Epoch #{epochId}</span>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error as Error} />
        ) : epoch ? (
          <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-title-lg text-ink-900">Epoch #{epochId}</h1>
                  {epoch.status === 'ACTIVE' ? (
                    <span className="badge-accent">Active</span>
                  ) : epoch.status === 'COMPLETED' ? (
                    <span className="badge-positive">Completed</span>
                  ) : (
                    <span className="badge-neutral">{epoch.status}</span>
                  )}
                </div>
                <p className="text-body text-ink-500">
                  Published {new Date(epoch.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link 
                  href={`/epoch/${epochId - 1}`}
                  className={`btn-secondary btn-sm ${epochId <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
                <Link 
                  href={`/epoch/${epochId + 1}`}
                  className="btn-secondary btn-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="kpi-card">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-4 h-4 text-ink-500" />
                  <span className="kpi-label mb-0">Total Distributed</span>
                </div>
                <p className="kpi-value">{formatSol(epoch.totalSol)} SOL</p>
                {epoch.totalToken !== '0' && (
                  <p className="kpi-sublabel">+ {formatNumber(epoch.totalToken)} tokens</p>
                )}
              </div>

              <div className="kpi-card">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-ink-500" />
                  <span className="kpi-label mb-0">Eligible Holders</span>
                </div>
                <p className="kpi-value">{formatNumber(epoch.holderCount)}</p>
                <p className="kpi-sublabel">wallets in snapshot</p>
              </div>

              <div className="kpi-card">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-ink-500" />
                  <span className="kpi-label mb-0">Claims</span>
                </div>
                <p className="kpi-value">
                  {epoch.claimCount} / {epoch.holderCount}
                </p>
                <p className="kpi-sublabel">
                  {((epoch.claimCount / epoch.holderCount) * 100).toFixed(1)}% claimed
                </p>
              </div>

              <div className="kpi-card">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-ink-500" />
                  <span className="kpi-label mb-0">Avg Reward</span>
                </div>
                <p className="kpi-value">
                  {formatSol(String(Number(epoch.totalSol) / epoch.holderCount))} SOL
                </p>
                <p className="kpi-sublabel">per holder</p>
              </div>
            </div>

            {/* Merkle Verification */}
            <div className="card-padded mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-ink-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title-sm text-ink-900 mb-1">Merkle Root</h3>
                  <p className="text-body-sm text-ink-500 mb-3">
                    On-chain verification hash for this epoch's distribution tree
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-mono text-ink-700 bg-surface-50 px-3 py-2 rounded truncate">
                      {epoch.merkleRoot}
                    </code>
                    <button onClick={copyMerkleRoot} className="btn-secondary btn-sm flex-shrink-0">
                      {copiedRoot ? <Check className="w-4 h-4 text-positive" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a 
                      href={`https://solscan.io/tx/${epoch.publishTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary btn-sm flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Details */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Fund Allocation */}
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-200">
                  <h3 className="text-title-sm text-ink-900">Fund Allocation</h3>
                </div>
                <div className="divide-y divide-surface-100">
                  {[
                    { label: 'Holder Rewards', value: epoch.rewardsSol, percent: epoch.rewardsPercent || 40 },
                    { label: 'Buyback & Burn', value: epoch.buybackSol, percent: epoch.buybackPercent || 30 },
                    { label: 'Auto-LP', value: epoch.autoLpSol, percent: epoch.autoLpPercent || 20 },
                    { label: 'Treasury', value: epoch.treasurySol, percent: epoch.treasuryPercent || 10 },
                  ].map((item) => (
                    <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-body-sm text-ink-700">{item.label}</span>
                        <span className="text-caption text-ink-500">{item.percent}%</span>
                      </div>
                      <span className="mono-value font-medium">{formatSol(item.value || '0')} SOL</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-surface-200">
                  <h3 className="text-title-sm text-ink-900">Transactions</h3>
                </div>
                <div className="divide-y divide-surface-100">
                  {[
                    { label: 'Epoch Published', hash: epoch.publishTx },
                    { label: 'Fee Claim', hash: epoch.feeClaimTx },
                    { label: 'Buyback Swap', hash: epoch.buybackTx },
                    { label: 'Burn', hash: epoch.burnTx },
                  ].map((tx) => (
                    <div key={tx.label} className="px-6 py-4 flex items-center justify-between">
                      <span className="text-body-sm text-ink-700">{tx.label}</span>
                      {tx.hash ? (
                        <a 
                          href={`https://solscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono-value text-accent hover:underline flex items-center gap-1"
                        >
                          {shortenAddress(tx.hash)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-body-sm text-ink-300">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Earners */}
            {epoch.topEarners && epoch.topEarners.length > 0 && (
              <div className="card overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-surface-200">
                  <h3 className="text-title-sm text-ink-900">Top Earners</h3>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Wallet</th>
                      <th>Tokens Held</th>
                      <th>Reward</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {epoch.topEarners.slice(0, 10).map((earner: any, index: number) => (
                      <tr key={earner.wallet}>
                        <td className="text-ink-500">{index + 1}</td>
                        <td>
                          <Link 
                            href={`/earnings?wallet=${earner.wallet}`}
                            className="mono-value text-accent hover:underline"
                          >
                            {shortenAddress(earner.wallet)}
                          </Link>
                        </td>
                        <td className="mono-value">{formatNumber(earner.tokenBalance)}</td>
                        <td className="mono-value font-medium">{formatSol(earner.reward)} SOL</td>
                        <td>
                          {earner.claimed ? (
                            <span className="badge-positive">Claimed</span>
                          ) : (
                            <span className="badge-neutral">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <EmptyState epochId={epochId} />
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="skeleton h-10 w-40" />
      </div>
      <div className="grid sm:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-padded">
            <div className="skeleton h-4 w-24 mb-4" />
            <div className="skeleton h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="card-padded">
        <div className="skeleton h-24 w-full" />
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
      <h3 className="text-title-sm text-ink-900 mb-2">Error Loading Epoch</h3>
      <p className="text-body-sm text-ink-500 max-w-sm mx-auto">
        {error.message || 'Unable to fetch epoch data. Please try again.'}
      </p>
    </div>
  );
}

function EmptyState({ epochId }: { epochId: number }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-12 h-12 rounded-md bg-surface-100 flex items-center justify-center mx-auto mb-4">
        <FileText className="w-5 h-5 text-ink-500" />
      </div>
      <h3 className="text-title-sm text-ink-900 mb-2">Epoch Not Found</h3>
      <p className="text-body-sm text-ink-500 max-w-sm mx-auto mb-6">
        Epoch #{epochId} does not exist or has not been published yet.
      </p>
      <Link href="/epochs" className="btn-secondary">
        <ChevronLeft className="w-4 h-4" />
        Back to Epochs
      </Link>
    </div>
  );
}
