'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Lock,
  FileCheck,
  BarChart3
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated background */}
        <div className="flow-lines" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl animate-pulse-slow delay-1000" />

        <div className="container-wide relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-muted border border-accent/20 mb-8"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent-light">Live on Solana Mainnet</span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-display text-balance mb-6"
            >
              Earn SOL from liquidity fees—
              <span className="text-gradient">verifiable, transparent, automated.</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-foreground-secondary mb-10 max-w-2xl mx-auto text-balance"
            >
              The Solana flywheel that routes protocol fees to token holders. 
              Claim your share from every epoch with cryptographic proofs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/earnings" className="btn-primary btn-lg group">
                Open Earnings Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/epochs" className="btn-secondary btn-lg">
                View Live Metrics
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { label: 'Total Distributed', value: '847.2 SOL' },
                { label: 'Active Holders', value: '2,341' },
                { label: 'Current Epoch', value: '#127' },
                { label: 'Avg. APY', value: '12.4%' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-foreground-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-secondary">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-accent font-medium mb-3">
              Why Liquid
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-h1 text-balance">
              Built for trust, designed for scale
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Shield,
                title: 'Verifiable Payouts',
                description: 'Every distribution includes a Merkle proof. Verify your allocation on-chain without trust assumptions.',
              },
              {
                icon: Zap,
                title: 'Automated Flywheel',
                description: 'LP fees flow through swap, buyback, burn, and distribution automatically. No manual intervention required.',
              },
              {
                icon: Clock,
                title: 'Transparent Epochs',
                description: 'Clear epoch boundaries with published roots. Track every SOL from collection to distribution.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="card-interactive group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-5 group-hover:glow-accent transition-shadow">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-h3 mb-2">{feature.title}</h3>
                <p className="text-foreground-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-accent font-medium mb-3">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-h1 text-balance">
              From fees to your wallet in four steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            {[
              {
                step: '01',
                title: 'Collect Fees',
                description: 'LP positions accumulate trading fees automatically from Orca and Raydium pools.',
                icon: BarChart3,
              },
              {
                step: '02',
                title: 'Swap & Route',
                description: 'The keeper bot swaps collected fees to SOL and routes them through the flywheel.',
                icon: TrendingUp,
              },
              {
                step: '03',
                title: 'Publish Epoch',
                description: 'A Merkle root is calculated for all eligible holders and published on-chain.',
                icon: FileCheck,
              },
              {
                step: '04',
                title: 'Claim Rewards',
                description: 'Connect your wallet, verify your proof, and claim your SOL share instantly.',
                icon: Zap,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex gap-6 mb-8 last:mb-0"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent-muted border border-accent/30 flex items-center justify-center text-accent font-mono font-semibold">
                    {item.step}
                  </div>
                  {i < 3 && (
                    <div className="w-px h-16 bg-gradient-to-b from-accent/30 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-accent" />
                    <h3 className="text-h3">{item.title}</h3>
                  </div>
                  <p className="text-foreground-secondary">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-background-secondary">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left content */}
            <motion.div variants={stagger}>
              <motion.p variants={fadeInUp} className="text-accent font-medium mb-3">
                Security First
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-h1 mb-6">
                Enterprise-grade security for your rewards
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-foreground-secondary text-lg mb-8">
                Built with the same security standards expected by institutional DeFi. 
                Every component is designed for verifiability and auditability.
              </motion.p>

              <motion.div variants={stagger} className="space-y-4">
                {[
                  'Multisig treasury management',
                  'Configurable slippage limits',
                  'Circuit breaker for anomalies',
                  'Audit-ready epoch proofs',
                  'Permissioned keeper operations',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="card-glass p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-success-muted flex items-center justify-center">
                    <Lock className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Security Status</h4>
                    <p className="text-sm text-success">All systems operational</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Treasury Multisig', status: 'Active', color: 'success' },
                    { label: 'Keeper Health', status: 'Healthy', color: 'success' },
                    { label: 'Circuit Breaker', status: 'Armed', color: 'accent' },
                    { label: 'Last Epoch', status: '2 hours ago', color: 'default' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-foreground-secondary">{item.label}</span>
                      <span className={`badge-${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-success/10 rounded-full blur-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative card-glass text-center py-16 px-8"
          >
            {/* Background glow */}
            <div className="absolute inset-0 rounded-card overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-h1 mb-4">Ready to claim your rewards?</h2>
              <p className="text-foreground-secondary text-lg mb-8 max-w-xl mx-auto">
                Connect your wallet and see your earnings across all epochs. 
                Claim with a single transaction.
              </p>
              <Link href="/earnings" className="btn-primary btn-lg group">
                Open Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 bg-accent rounded-md opacity-20" />
                <div className="absolute inset-0.5 bg-accent rounded-sm" />
              </div>
              <span className="font-semibold">Liquid</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            </div>

            <p className="text-sm text-foreground-muted">
              © 2024 Liquid Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
