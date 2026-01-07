'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Zap, Clock, ChevronRight, ExternalLink } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="page-fade">
      {/* Navigation */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-wide h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink-900 rounded flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <span className="font-semibold text-ink-900">Epoch</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/epochs" className="text-body-sm text-ink-700 hover:text-ink-900 transition-colors">
              Epochs
            </Link>
            <Link href="/earnings" className="text-body-sm text-ink-700 hover:text-ink-900 transition-colors">
              Earnings
            </Link>
            <a href="https://docs.epoch.finance" className="text-body-sm text-ink-700 hover:text-ink-900 transition-colors flex items-center gap-1">
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          <Link href="/earnings" className="btn-primary btn-sm">
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container-default py-24 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-full mb-6">
            <span className="status-active" />
            <span className="text-caption text-ink-700">Live on Mainnet</span>
          </div>
          
          <h1 className="text-display text-ink-900 mb-6 text-balance">
            Automated token rewards distribution
          </h1>
          
          <p className="text-body text-ink-500 mb-10 max-w-lg leading-relaxed">
            Epoch automates buyback, burn, and LP fee distribution for Solana tokens. 
            Verifiable on-chain, transparent by design.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/earnings" className="btn-primary btn-lg">
              View Earnings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/epochs" className="btn-secondary btn-lg">
              Browse Epochs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-surface-200 bg-surface-50">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="kpi-label">Total Distributed</p>
              <p className="kpi-value">1,247.82 SOL</p>
            </div>
            <div>
              <p className="kpi-label">Epochs Completed</p>
              <p className="kpi-value">156</p>
            </div>
            <div>
              <p className="kpi-label">Unique Holders</p>
              <p className="kpi-value">4,892</p>
            </div>
            <div>
              <p className="kpi-label">Avg Epoch Yield</p>
              <p className="kpi-value">8.01 SOL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-default py-24">
        <div className="mb-16">
          <h2 className="text-title-lg text-ink-900 mb-3">How it works</h2>
          <p className="text-body text-ink-500 max-w-lg">
            The flywheel collects LP fees and routes them through automated processes each epoch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-padded">
            <div className="w-10 h-10 rounded-md bg-surface-100 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-ink-700" />
            </div>
            <h3 className="text-title-sm text-ink-900 mb-2">Fee Collection</h3>
            <p className="text-body-sm text-ink-500 leading-relaxed">
              LP fees are claimed from the Raydium pool and routed to the treasury every epoch.
            </p>
          </div>

          <div className="card-padded">
            <div className="w-10 h-10 rounded-md bg-surface-100 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-ink-700" />
            </div>
            <h3 className="text-title-sm text-ink-900 mb-2">Automated Routing</h3>
            <p className="text-body-sm text-ink-500 leading-relaxed">
              Funds are split: rewards to holders, buyback & burn, and auto-LP reinvestment.
            </p>
          </div>

          <div className="card-padded">
            <div className="w-10 h-10 rounded-md bg-surface-100 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-ink-700" />
            </div>
            <h3 className="text-title-sm text-ink-900 mb-2">Merkle Claims</h3>
            <p className="text-body-sm text-ink-500 leading-relaxed">
              Holder snapshots generate merkle trees. Claims are gas-efficient and verifiable.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Epochs */}
      <section className="border-t border-surface-200 bg-surface-50 py-24">
        <div className="container-default">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-title-lg text-ink-900 mb-1">Recent Epochs</h2>
              <p className="text-body-sm text-ink-500">Latest completed distribution cycles</p>
            </div>
            <Link href="/epochs" className="btn-ghost btn-sm">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Epoch</th>
                  <th>Distributed</th>
                  <th>Holders</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 156, amount: '8.24', holders: 342, status: 'completed' },
                  { id: 155, amount: '7.89', holders: 339, status: 'completed' },
                  { id: 154, amount: '9.12', holders: 335, status: 'completed' },
                  { id: 153, amount: '6.45', holders: 331, status: 'completed' },
                  { id: 152, amount: '8.91', holders: 328, status: 'completed' },
                ].map((epoch) => (
                  <tr key={epoch.id}>
                    <td className="font-medium text-ink-900">#{epoch.id}</td>
                    <td className="mono-value">{epoch.amount} SOL</td>
                    <td className="mono-value">{epoch.holders}</td>
                    <td>
                      <span className="badge-positive">Completed</span>
                    </td>
                    <td className="text-right">
                      <Link href={`/epoch/${epoch.id}`} className="btn-ghost btn-sm">
                        View
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-default py-24">
        <div className="card-padded text-center max-w-xl mx-auto">
          <BarChart3 className="w-10 h-10 text-ink-300 mx-auto mb-6" />
          <h2 className="text-title-lg text-ink-900 mb-3">Check your earnings</h2>
          <p className="text-body text-ink-500 mb-8">
            Enter your wallet address to view pending rewards and claim history.
          </p>
          <Link href="/earnings" className="btn-primary btn-lg">
            Open Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-12">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-ink-900 rounded flex items-center justify-center">
                <span className="text-white font-semibold text-xs">E</span>
              </div>
              <span className="text-body-sm text-ink-500">© 2026 Epoch Protocol</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://twitter.com/epochprotocol" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Twitter
              </a>
              <a href="https://discord.gg/epoch" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Discord
              </a>
              <a href="https://github.com/epoch-protocol" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                GitHub
              </a>
              <a href="https://docs.epoch.finance" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
