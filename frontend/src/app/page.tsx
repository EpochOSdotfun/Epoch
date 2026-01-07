'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { FlywheelDiagram } from '@/components/flywheel-diagram';
import { DashboardPreview } from '@/components/dashboard-preview';
import { TransparencyTable } from '@/components/transparency-table';
import { FlowLines } from '@/components/flow-lines';

export default function HomePage() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FlowLines />

      {/* Hero Section */}
      <section className="container-editorial section-gap pb-16 md:pb-24">
        <div className="max-w-3xl">
          <div
            ref={addRevealRef(0)}
            className="reveal"
            style={{ animationDelay: '0ms' }}
          >
            <p className="label mb-6">Solana LP Fee Distribution</p>
          </div>

          <h1
            ref={addRevealRef(1)}
            className="reveal headline mb-8"
            style={{ animationDelay: '40ms' }}
          >
            Automated rewards
            <br />
            <span className="text-accent">for token holders</span>
          </h1>

          <p
            ref={addRevealRef(2)}
            className="reveal subhead mb-10"
            style={{ animationDelay: '80ms' }}
          >
            The flywheel collects LP fees, executes buybacks, burns tokens, 
            and distributes SOL—all on-chain, every epoch.
          </p>

          <div
            ref={addRevealRef(3)}
            className="reveal flex flex-wrap gap-4 mb-16"
            style={{ animationDelay: '120ms' }}
          >
            <Link href="/earnings" className="btn-primary">
              Check Earnings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/EpochOSdotfun/Epoch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Strip */}
          <div
            ref={addRevealRef(4)}
            className="reveal flex flex-wrap gap-8"
            style={{ animationDelay: '160ms' }}
          >
            <div className="trust-item">
              <span className="trust-dot" />
              Multisig Authority
            </div>
            <div className="trust-item">
              <span className="trust-dot" />
              Merkle Proofs
            </div>
            <div className="trust-item">
              <span className="trust-dot" />
              Slippage Limits
            </div>
            <div className="trust-item">
              <span className="trust-dot" />
              Open Source
            </div>
          </div>
        </div>
      </section>

      <div className="divider-accent container-editorial" />

      {/* Flywheel Diagram Section */}
      <section className="container-editorial section-gap">
        <div
          ref={addRevealRef(5)}
          className="reveal mb-12"
          style={{ animationDelay: '0ms' }}
        >
          <p className="label mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            The distribution flywheel
          </h2>
        </div>

        <div
          ref={addRevealRef(6)}
          className="reveal"
          style={{ animationDelay: '60ms' }}
        >
          <FlywheelDiagram />
        </div>
      </section>

      <div className="divider container-editorial" />

      {/* Split Narrative + Dashboard Preview */}
      <section className="container-editorial section-gap">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Scrolling Narrative */}
          <div className="space-y-24">
            <div
              ref={addRevealRef(7)}
              className="reveal"
              style={{ animationDelay: '0ms' }}
            >
              <span className="label text-accent">01</span>
              <h3 className="text-2xl font-light mt-3 mb-4">Fee Collection</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The keeper bot monitors liquidity pool positions and automatically
                claims accrued fees. All collected funds flow into the protocol
                treasury, ready for the next epoch's distribution cycle.
              </p>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="stat-large text-accent">24h</span>
                <span className="text-[var(--text-muted)]">Epoch Duration</span>
              </div>
            </div>

            <div
              ref={addRevealRef(8)}
              className="reveal"
              style={{ animationDelay: '0ms' }}
            >
              <span className="label text-accent">02</span>
              <h3 className="text-2xl font-light mt-3 mb-4">Smart Routing</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Fees are split according to on-chain configuration: rewards to
                holders, buyback & burn for deflation, auto-LP for deeper
                liquidity. Every route is verifiable on-chain.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-light">50%</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Rewards</div>
                </div>
                <div>
                  <div className="text-2xl font-light">30%</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Buyback</div>
                </div>
                <div>
                  <div className="text-2xl font-light">20%</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Auto-LP</div>
                </div>
              </div>
            </div>

            <div
              ref={addRevealRef(9)}
              className="reveal"
              style={{ animationDelay: '0ms' }}
            >
              <span className="label text-accent">03</span>
              <h3 className="text-2xl font-light mt-3 mb-4">Merkle Distribution</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Each epoch generates a merkle tree of eligible holders weighted by
                their token balance. The root is published on-chain, allowing
                gas-efficient claims with cryptographic proof of eligibility.
              </p>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="stat-large text-accent">~0.001</span>
                <span className="text-[var(--text-muted)]">SOL per claim</span>
              </div>
            </div>

            <div
              ref={addRevealRef(10)}
              className="reveal"
              style={{ animationDelay: '0ms' }}
            >
              <span className="label text-accent">04</span>
              <h3 className="text-2xl font-light mt-3 mb-4">Claim & Compound</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Holders claim accumulated rewards anytime. The flywheel continues
                spinning: buybacks create buy pressure, burns reduce supply, and
                deeper liquidity enables larger positions.
              </p>
              <Link
                href="/earnings"
                className="inline-flex items-center gap-2 mt-6 text-accent hover:underline underline-offset-4"
              >
                View your earnings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Pinned Dashboard Preview */}
          <div className="hidden lg:block">
            <div className="sticky-section">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      <div className="divider container-editorial" />

      {/* Transparency Section */}
      <section className="container-editorial section-gap">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div
            ref={addRevealRef(11)}
            className="reveal lg:col-span-1"
            style={{ animationDelay: '0ms' }}
          >
            <p className="label mb-3">Transparency</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
              Every epoch,
              <br />
              on-chain
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              Full audit trail of distributions. Merkle roots published to Solana.
              Verify any claim independently.
            </p>
            <Link href="/epochs" className="btn-secondary">
              View All Epochs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            ref={addRevealRef(12)}
            className="reveal lg:col-span-2"
            style={{ animationDelay: '60ms' }}
          >
            <TransparencyTable />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-editorial py-12 border-t border-[var(--border-dim)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-sm text-[var(--text-muted)]">Epoch OS</span>
          </div>
          <div className="flex gap-8">
            <a
              href="https://github.com/EpochOSdotfun/Epoch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/epochs"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Epochs
            </Link>
            <Link
              href="/earnings"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Earnings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
