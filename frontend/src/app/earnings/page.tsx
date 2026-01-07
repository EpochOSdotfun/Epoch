'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, Wallet, CheckCircle, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useWalletEarnings } from '@/hooks/useWalletEarnings';
import { WalletButton } from '@/components/wallet-button';
import { ClaimButton } from '@/components/claim-button';
import { formatSol, formatNumber, shortenAddress } from '@/lib/utils';

export default function EarningsPage() {
  const { connected, publicKey } = useWallet();
  const [searchAddress, setSearchAddress] = useState('');
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const walletAddress = searchAddress || (connected && publicKey ? publicKey.toBase58() : '');
  const { data: earnings, isLoading, error } = useWalletEarnings(walletAddress);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container-editorial section-gap pb-16">
        <div
          ref={addRevealRef(0)}
          className="reveal max-w-2xl"
          style={{ animationDelay: '0ms' }}
        >
          <p className="label mb-4">Wallet Lookup</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Your earnings
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
            Track rewards by epoch, view your claim history, and withdraw accumulated SOL.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Enter wallet address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="input pl-11"
              />
            </div>
            <button type="submit" className="btn-secondary">
              Search
            </button>
          </form>

          {!connected && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-[var(--text-muted)]">or connect your wallet</span>
              <WalletButton />
            </div>
          )}

          {walletAddress && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-4">
              <span>Viewing:</span>
              <code className="mono text-[var(--accent)]">{shortenAddress(walletAddress)}</code>
            </div>
          )}
        </div>
      </section>

      <div className="divider container-editorial" />

      {/* Content */}
      <section className="container-editorial section-gap">
        {walletAddress ? (
          <>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error as Error} />
            ) : earnings ? (
              <EarningsContent earnings={earnings} walletAddress={walletAddress} />
            ) : (
              <EmptyState variant="no-data" />
            )}
          </>
        ) : (
          <EmptyState variant="no-wallet" />
        )}
      </section>
    </div>
  );
}

function EarningsContent({ earnings, walletAddress }: { earnings: any; walletAddress: string }) {
  const hasUnclaimed = Number(earnings.unclaimedSol) > 0;

  return (
    <div className="space-y-16">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-8">
        <StatCard
          icon={<Wallet className="w-4 h-4" />}
          label="Total Earned"
          value={`${formatSol(earnings.totalEarnedSol)} SOL`}
          sublabel={
            earnings.totalEarnedToken !== '0'
              ? `+ ${formatNumber(earnings.totalEarnedToken)} tokens`
              : undefined
          }
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4" />}
          label="Claimed"
          value={`${formatSol(earnings.totalClaimedSol)} SOL`}
          sublabel={`${earnings.claimedEpochs} of ${earnings.eligibleEpochs} epochs`}
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Unclaimed"
          value={`${formatSol(earnings.unclaimedSol)} SOL`}
          sublabel={`${earnings.eligibleEpochs - earnings.claimedEpochs} epochs pending`}
          highlight={hasUnclaimed}
        />
      </div>

      {/* Claim Banner */}
      {hasUnclaimed && (
        <div className="card-transparent border-[var(--accent)]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-light mb-2">Rewards available</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {formatSol(earnings.unclaimedSol)} SOL from {earnings.eligibleEpochs - earnings.claimedEpochs} unclaimed epochs
              </p>
            </div>
            <ClaimButton wallet={walletAddress} unclaimedSol={earnings.unclaimedSol} />
          </div>
        </div>
      )}

      {/* Epoch Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light">Epoch breakdown</h3>
          <Link href="/epochs" className="btn-ghost text-sm">
            View all epochs
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {earnings.epochBreakdown && earnings.epochBreakdown.length > 0 ? (
          <div className="card-transparent overflow-hidden">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Epoch</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {earnings.epochBreakdown.map((epoch: any) => (
                  <tr key={epoch.epochId}>
                    <td className="mono text-[var(--text-primary)]">#{epoch.epochId}</td>
                    <td>
                      <span className="text-[var(--text-primary)]">{formatSol(epoch.amount)}</span>
                      <span className="text-[var(--text-muted)] ml-1">SOL</span>
                    </td>
                    <td>
                      {epoch.claimed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)]">
                          <CheckCircle className="w-3 h-3" />
                          Claimed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="hidden md:table-cell text-[var(--text-muted)]">
                      {new Date(epoch.date).toLocaleDateString()}
                    </td>
                    <td>
                      <Link href={`/epoch/${epoch.epochId}`} className="btn-ghost p-2">
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-transparent text-center py-12">
            <p className="text-[var(--text-muted)]">No epoch data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card-transparent ${highlight ? 'border-[var(--accent)]/30' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={highlight ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}>
          {icon}
        </span>
        <span className="label mb-0">{label}</span>
      </div>
      <p className={`text-2xl font-light ${highlight ? 'text-[var(--accent)]' : ''}`}>{value}</p>
      {sublabel && <p className="text-xs text-[var(--text-muted)] mt-2">{sublabel}</p>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-24">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[var(--text-muted)]">Loading earnings data...</p>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="text-center py-24">
      <div className="w-12 h-12 border border-red-400/30 flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="w-5 h-5 text-red-400" />
      </div>
      <h3 className="text-lg font-light mb-2">Error loading data</h3>
      <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
        {error.message || 'Unable to fetch earnings data. Please try again.'}
      </p>
    </div>
  );
}

function EmptyState({ variant }: { variant: 'no-wallet' | 'no-data' }) {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 border border-[var(--border-dim)] flex items-center justify-center mx-auto mb-6">
        {variant === 'no-wallet' ? (
          <Search className="w-6 h-6 text-[var(--text-muted)]" />
        ) : (
          <Wallet className="w-6 h-6 text-[var(--text-muted)]" />
        )}
      </div>
      <h3 className="text-lg font-light mb-2">
        {variant === 'no-wallet' ? 'Enter a wallet address' : 'No earnings found'}
      </h3>
      <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
        {variant === 'no-wallet'
          ? 'Connect your wallet or search any Solana address to view earnings.'
          : 'This wallet has no earnings history yet.'}
      </p>
    </div>
  );
}
