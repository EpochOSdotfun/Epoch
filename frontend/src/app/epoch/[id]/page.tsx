'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Hash, Users, Coins, ExternalLink, Download, CheckCircle } from 'lucide-react';
import { useEpoch } from '@/hooks/useEpoch';
import { formatSol, formatNumber } from '@/lib/utils';

export default function EpochPage() {
  const params = useParams();
  const epochId = params.id as string;
  const { data: epoch, isLoading, error } = useEpoch(parseInt(epochId));
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!epoch) return;

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
  }, [epoch]);

  const addRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !epoch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border border-[var(--border-dim)] flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-light mb-2">Epoch not found</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">Epoch #{epochId} does not exist</p>
          <Link href="/epochs" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Epochs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container-editorial section-gap pb-12">
        <Link
          href="/epochs"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Epochs
        </Link>

        <div
          ref={addRevealRef(0)}
          className="reveal"
          style={{ animationDelay: '0ms' }}
        >
          <p className="label mb-4">Distribution Epoch</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Epoch <span className="text-accent">#{epoch.epochId}</span>
          </h1>
          <p className="text-[var(--text-secondary)]">
            Published on{' '}
            {new Date(epoch.publishedAt).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </section>

      <div className="divider container-editorial" />

      {/* Stats */}
      <section className="container-editorial section-gap">
        <div
          ref={addRevealRef(1)}
          className="reveal grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          style={{ animationDelay: '40ms' }}
        >
          <StatCard
            icon={<Coins className="w-4 h-4" />}
            label="Total Rewards"
            value={`${formatSol(epoch.rewardsSol)} SOL`}
          />
          <StatCard
            icon={<CheckCircle className="w-4 h-4" />}
            label="Claimed"
            value={`${epoch.claimProgress}%`}
            highlight
          />
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Claimants"
            value={`${formatNumber(epoch.numClaimants)} / ${formatNumber(epoch.totalAllocations)}`}
          />
          <StatCard
            icon={<Hash className="w-4 h-4" />}
            label="Slot Range"
            value={`${formatNumber(epoch.startSlot)}–${formatNumber(epoch.endSlot)}`}
            mono
          />
        </div>

        {/* Verification */}
        <div
          ref={addRevealRef(2)}
          className="reveal mb-16"
          style={{ animationDelay: '80ms' }}
        >
          <h2 className="text-xl font-light mb-6">Verification</h2>
          <div className="card-transparent">
            <div className="space-y-0">
              <VerificationRow
                label="Merkle Root"
                value={epoch.merkleRoot}
                mono
              />
              {epoch.csvHash && (
                <VerificationRow
                  label="CSV Hash (SHA-256)"
                  value={epoch.csvHash}
                  mono
                />
              )}
              {epoch.publishSig && (
                <VerificationRow
                  label="Publish Transaction"
                  value={`${epoch.publishSig.slice(0, 24)}...`}
                  href={`https://solscan.io/tx/${epoch.publishSig}`}
                  mono
                />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          ref={addRevealRef(3)}
          className="reveal flex flex-wrap gap-4"
          style={{ animationDelay: '120ms' }}
        >
          <a
            href={`/api/epochs/${epoch.epochId}/csv`}
            className="btn-primary"
            download
          >
            <Download className="w-4 h-4" />
            Download CSV
          </a>
          {epoch.publishSig && (
            <a
              href={`https://solscan.io/tx/${epoch.publishSig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View on Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="card-transparent">
      <div className="flex items-center gap-2 mb-4">
        <span className={highlight ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}>
          {icon}
        </span>
        <span className="label mb-0">{label}</span>
      </div>
      <p
        className={`text-2xl font-light ${highlight ? 'text-[var(--accent)]' : ''} ${
          mono ? 'mono text-lg' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function VerificationRow({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-[var(--border-dim)] last:border-b-0">
      <span className="text-[var(--text-muted)] text-sm mb-2 md:mb-0">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-[var(--accent)] hover:underline underline-offset-4 ${
            mono ? 'mono text-sm' : ''
          }`}
        >
          {value}
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <code
          className={`text-sm bg-[var(--bg-primary)] px-3 py-1 text-[var(--text-secondary)] break-all ${
            mono ? 'mono' : ''
          }`}
        >
          {value}
        </code>
      )}
    </div>
  );
}
