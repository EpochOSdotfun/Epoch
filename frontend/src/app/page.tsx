'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, RefreshCw, Flame, TrendingUp, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricsGrid } from '@/components/metrics-grid';
import { FlywheelDiagram } from '@/components/flywheel-diagram';

export default function Home() {
  const { data: metrics, isLoading } = useMetrics();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
              </span>
              <span className="text-accent-primary text-sm font-medium">Live on Solana Mainnet</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              The <span className="text-gradient">Flywheel</span> That
              <br />Rewards Holders
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Automated SOL rewards from LP fees. Hold tokens, earn SOL. 
              No staking required. Just hold and claim when you want.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/earnings" className="btn-primary text-lg">
                Check Your Earnings
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg">
                How It Works
              </a>
            </div>
          </motion.div>

          {/* Live Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MetricsGrid metrics={metrics} isLoading={isLoading} />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              How The <span className="text-gradient">Flywheel</span> Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A self-reinforcing cycle that generates value for holders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-primary/10">
                    <Zap className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">LP Fees Accumulate</h3>
                    <p className="text-text-secondary">
                      Trading activity generates LP fees that flow to the treasury automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-secondary/10">
                    <RefreshCw className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Converted to SOL</h3>
                    <p className="text-text-secondary">
                      Keeper bot safely swaps accumulated fees to SOL with slippage protection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-warning/10">
                    <Flame className="w-6 h-6 text-accent-warning" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Routed Actions</h3>
                    <p className="text-text-secondary">
                      SOL is distributed: 25% rewards, 25% buyback, 25% burn, 25% auto-LP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent-primary/10">
                    <TrendingUp className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Claim Your SOL</h3>
                    <p className="text-text-secondary">
                      Each epoch, your allocation is calculated. Claim whenever you want.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <FlywheelDiagram />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Built for <span className="text-gradient">Trust</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Transparent, verifiable, and secure by design
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="card text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Merkle Proofs</h3>
              <p className="text-text-secondary">
                Every allocation is verifiable on-chain. You can independently verify your rewards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-accent-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Epoch Transparency</h3>
              <p className="text-text-secondary">
                All epoch data, allocations, and Merkle roots are published for full transparency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-3">On-Chain Claims</h3>
              <p className="text-text-secondary">
                Smart contracts prevent double claims and ensure fair distribution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative card gradient-border text-center py-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Check Your <span className="text-gradient">Rewards</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
              Paste your wallet address or connect your wallet to see your earnings.
            </p>
            <Link href="/earnings" className="btn-primary text-lg">
              View Earnings Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border-default">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary" />
            <span className="font-display font-bold text-lg">SOL Flywheel</span>
          </div>
          <div className="flex gap-6 text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-text-primary transition-colors">Discord</a>
            <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
          </div>
          <div className="text-text-muted text-sm">
            Program: <code className="text-accent-primary">Distr...XXX</code>
          </div>
        </div>
      </footer>
    </div>
  );
}

