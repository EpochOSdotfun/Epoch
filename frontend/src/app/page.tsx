'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricsGrid } from '@/components/metrics-grid';
import { formatSol } from '@/lib/utils';

export default function Home() {
  const { data: metrics, isLoading } = useMetrics();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section border-b border-border-default">
        <div className="container-main">
          <div className="max-w-2xl">
            <p className="text-caption text-text-muted mb-4">
              Solana Rewards Distribution
            </p>
            <h1 className="text-display-lg font-semibold text-text-primary mb-6">
              Automated SOL rewards from LP fees
            </h1>
            <p className="text-body-lg text-text-secondary mb-8 max-w-lg">
              Hold tokens, earn SOL. Verified allocations every epoch. 
              Claim when you want—no staking, no lockups.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/earnings" className="btn-primary">
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://docs.epoch.fund" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Documentation
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section-sm bg-bg-secondary border-b border-border-default">
        <div className="container-main">
          <MetricsGrid metrics={metrics} isLoading={isLoading} />
        </div>
      </section>

      {/* How it works */}
      <section className="section border-b border-border-default">
        <div className="container-main">
          <div className="max-w-lg mb-12">
            <h2 className="text-heading font-semibold mb-3">How it works</h2>
            <p className="text-body text-text-secondary">
              A transparent rewards cycle powered by LP trading fees.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <ProcessStep 
              number="01"
              title="Fees accumulate"
              description="Trading activity generates LP fees that flow to the treasury."
            />
            <ProcessStep 
              number="02"
              title="Convert to SOL"
              description="Keeper bot swaps fees to SOL with slippage protection."
            />
            <ProcessStep 
              number="03"
              title="Route funds"
              description="SOL distributed: rewards, buyback, burn, auto-LP."
            />
            <ProcessStep 
              number="04"
              title="Claim rewards"
              description="Verify your allocation and claim when ready."
            />
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="section border-b border-border-default">
        <div className="container-main">
          <div className="max-w-lg mb-12">
            <h2 className="text-heading font-semibold mb-3">Built for verification</h2>
            <p className="text-body text-text-secondary">
              Every allocation is provable. Every claim is transparent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              title="Merkle proofs"
              description="Cryptographic verification for every wallet allocation. Independently verifiable on-chain."
            />
            <FeatureCard
              title="Epoch transparency"
              description="All epoch data, snapshots, and roots published publicly with audit trails."
            />
            <FeatureCard
              title="On-chain enforcement"
              description="Smart contracts prevent double claims and enforce fair distribution rules."
            />
          </div>
        </div>
      </section>

      {/* Stats highlight */}
      {metrics && (
        <section className="section-sm bg-bg-secondary">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-display font-semibold text-text-primary">
                  {formatSol(metrics.totalDistributed)}
                </div>
                <div className="text-caption text-text-muted mt-1">SOL distributed</div>
              </div>
              <div>
                <div className="text-display font-semibold text-text-primary">
                  {metrics.holderCount.toLocaleString()}
                </div>
                <div className="text-caption text-text-muted mt-1">Token holders</div>
              </div>
              <div>
                <div className="text-display font-semibold text-text-primary">
                  #{metrics.currentEpoch}
                </div>
                <div className="text-caption text-text-muted mt-1">Current epoch</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-heading font-semibold mb-3">Check your rewards</h2>
            <p className="text-body text-text-secondary mb-6">
              Enter any wallet address or connect your wallet to view earnings.
            </p>
            <Link href="/earnings" className="btn-primary">
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProcessStep({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="group">
      <div className="text-micro font-medium text-text-muted mb-3">{number}</div>
      <h3 className="text-body font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-caption text-text-secondary">{description}</p>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description 
}: { 
  title: string; 
  description: string;
}) {
  return (
    <div className="card">
      <h3 className="text-body font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-caption text-text-secondary">{description}</p>
    </div>
  );
}
