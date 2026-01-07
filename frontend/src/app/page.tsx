'use client';

import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, Shield, FileCheck, Lock, Eye } from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';
import { DashboardPreview } from '@/components/dashboard-preview';
import { LiveMetrics } from '@/components/live-metrics';
import { cn } from '@/lib/utils';

export default function Home() {
  const { data: metrics, isLoading } = useMetrics();

  return (
    <div className="page-fade">
      {/* ========================================
          HERO - Left-aligned, with dashboard preview
          ======================================== */}
      <section className="section-gap-lg border-b border-surface-100">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-5 space-y-6">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-200 bg-bg-secondary">
                <span className="status-dot-live" />
                <span className="text-caption text-ink-500">Live on Solana Mainnet</span>
              </div>

              {/* Headline */}
              <h1 className="text-h1 text-ink-900">
                Earn SOL from{' '}
                <span className="text-accent">LP fees</span>.
                <br />
                Automatically.
              </h1>

              {/* Subhead */}
              <p className="text-body text-ink-500 max-w-md">
                Hold tokens. Accumulate rewards each epoch. Claim when you want. 
                No staking. No lockups. Just transparent, verifiable earnings.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/earnings" className="btn-primary">
                  Check Earnings
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/docs" className="btn-secondary">
                  Read Docs
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6 pt-4 text-caption text-ink-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-positive" />
                  Open source
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-positive" />
                  Merkle verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-positive" />
                  Non-custodial
                </span>
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="lg:col-span-7 lg:pl-8">
              <DashboardPreview metrics={metrics} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS - 2-column: timeline left, metrics right
          ======================================== */}
      <section className="section-gap bg-bg-secondary/30" id="how-it-works">
        <div className="container-default">
          {/* Section Header */}
          <div className="mb-12 max-w-xl">
            <h2 className="text-h2 text-ink-900 mb-3">How It Works</h2>
            <p className="text-body text-ink-500">
              A straightforward process that runs automatically. Your only action is claiming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Timeline */}
            <div className="lg:col-span-6">
              <div className="timeline">
                <TimelineStep
                  number="01"
                  title="LP Fees Accumulate"
                  description="Trading activity on the LP generates fees. These flow to the protocol treasury automatically."
                />
                <TimelineStep
                  number="02"
                  title="Converted to SOL"
                  description="The keeper bot safely swaps accumulated tokens to SOL with slippage protection and circuit breakers."
                />
                <TimelineStep
                  number="03"
                  title="Epoch Published"
                  description="Each epoch, holdings are snapshotted and rewards calculated. Merkle root published on-chain."
                />
                <TimelineStep
                  number="04"
                  title="Claim Your SOL"
                  description="Provide your proof, verify on-chain, and claim directly to your wallet. No intermediaries."
                  isLast
                />
              </div>
            </div>

            {/* Right: Live Metrics */}
            <div className="lg:col-span-6">
              <div className="sticky top-24">
                <h3 className="text-title-sm text-ink-900 mb-5">Live Protocol Stats</h3>
                <LiveMetrics metrics={metrics} isLoading={isLoading} />

                {/* Additional Context */}
                <div className="mt-6 p-4 rounded-lg border border-surface-100 bg-bg-secondary">
                  <p className="text-body-sm text-ink-500">
                    <span className="text-ink-700 font-medium">Distribution:</span>{' '}
                    25% rewards · 25% buyback · 25% burn · 25% auto-LP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECURITY & TRANSPARENCY - Audit Checklist Style
          ======================================== */}
      <section className="section-gap border-t border-surface-100">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Header */}
            <div className="lg:col-span-4">
              <h2 className="text-h2 text-ink-900 mb-3">Security & Transparency</h2>
              <p className="text-body text-ink-500">
                Every claim is verifiable. Every epoch is auditable. No trust required.
              </p>
              <div className="mt-6">
                <a
                  href="https://github.com/epoch-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View Source
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Checklist */}
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="card">
                <div className="divide-y divide-surface-50">
                  <ChecklistItem
                    icon={Shield}
                    title="Merkle Proof Verification"
                    description="Every allocation is cryptographically provable. Independent verification available."
                    status="verified"
                  />
                  <ChecklistItem
                    icon={FileCheck}
                    title="Public Epoch Data"
                    description="All epoch snapshots, allocations, and Merkle roots are published and downloadable."
                    status="verified"
                  />
                  <ChecklistItem
                    icon={Lock}
                    title="Non-Custodial Claims"
                    description="Rewards go directly from program to wallet. No intermediary holds funds."
                    status="verified"
                  />
                  <ChecklistItem
                    icon={Eye}
                    title="Open Source Contracts"
                    description="Distributor and Controller programs are fully auditable on GitHub."
                    status="verified"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA - Simple, confident
          ======================================== */}
      <section className="section-gap bg-bg-secondary/30 border-t border-surface-100">
        <div className="container-narrow text-center">
          <h2 className="text-h2 text-ink-900 mb-4">
            Check your rewards
          </h2>
          <p className="text-body text-ink-500 mb-8 max-w-md mx-auto">
            Enter any wallet address to view earnings history and claimable SOL.
          </p>
          <Link href="/earnings" className="btn-primary btn-lg">
            View Earnings Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// Timeline Step Component
function TimelineStep({
  number,
  title,
  description,
  isLast = false,
}: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className={cn('timeline-item', isLast && 'pb-0')}>
      <div className="timeline-dot" />
      <div className="timeline-content">
        <span className="text-caption text-ink-300 font-mono">{number}</span>
        <h4 className="text-title-sm text-ink-900 mt-1 mb-2">{title}</h4>
        <p className="text-body-sm text-ink-500">{description}</p>
      </div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status: 'verified' | 'pending';
}) {
  return (
    <div className="checklist-item px-5 py-4">
      <div className={cn(
        'checklist-icon',
        status === 'verified' ? 'checklist-icon-done' : 'checklist-icon-pending'
      )}>
        {status === 'verified' ? (
          <Check className="w-3 h-3" />
        ) : (
          <Icon className="w-3 h-3" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-body-sm font-medium text-ink-900">{title}</h4>
          {status === 'verified' && (
            <span className="badge-positive">Verified</span>
          )}
        </div>
        <p className="text-caption text-ink-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
