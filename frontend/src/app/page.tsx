'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Zap, 
  BarChart3, 
  Lock, 
  Users,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

import { 
  LiquidRibbon, 
  AnimatedSectionDivider, 
  MetricCard,
  SpringChart,
  BrowserMockup,
  DashboardPreviewContent 
} from '@/components/animations';

// ============================================
// ENTERPRISE PRODUCT SITE
// Clean • Calm • Trustworthy
// ============================================

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <HeroSection />
      <AnimatedSectionDivider />
      <MetricsSection />
      <AnimatedSectionDivider />
      <FeaturesSection />
      <AnimatedSectionDivider />
      <HowItWorksSection />
      <AnimatedSectionDivider />
      <TrustSection />
      <AnimatedSectionDivider />
      <CTASection />
      <Footer />
    </div>
  );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center py-20 px-4">
      {/* Liquid ribbon background */}
      <LiquidRibbon className="opacity-60" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 container-default"
        style={{ y, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted border border-accent-primary/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
                </span>
                <span className="text-accent-primary text-body-sm font-medium">
                  Live on Solana Mainnet
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-display-xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Automated Rewards
              <br />
              <span className="text-gradient">Built for Scale</span>
            </motion.h1>

            <motion.p
              className="text-body-lg text-text-secondary max-w-xl mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Enterprise-grade token distribution infrastructure. 
              Transparent Merkle proofs, automated epoch cycles, 
              and verifiable on-chain claims.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/earnings" className="btn-primary btn-lg group">
                View Dashboard
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how-it-works" className="btn-secondary btn-lg">
                How It Works
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-text-muted">
                <Shield className="w-4 h-4" />
                <span className="text-body-sm">Audited</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Lock className="w-4 h-4" />
                <span className="text-body-sm">Non-custodial</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Users className="w-4 h-4" />
                <span className="text-body-sm">12,000+ Holders</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <BrowserMockup enableGlow>
              <DashboardPreviewContent />
            </BrowserMockup>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-caption uppercase tracking-wider">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// METRICS SECTION
// ============================================
function MetricsSection() {
  return (
    <section className="section bg-section-gradient">
      <div className="container-default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-caption text-accent-primary uppercase tracking-wider mb-4">
            Protocol Metrics
          </p>
          <h2 className="text-display-md mb-4">
            Transparent Performance Data
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Real-time metrics updated every epoch. All data is verifiable on-chain.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={<BarChart3 className="w-5 h-5 text-accent-primary" />}
            label="Total Distributed"
            value="847.23"
            suffix="SOL"
            trend={{ value: "12.4%", positive: true }}
            delay={0}
          />
          <MetricCard
            icon={<Users className="w-5 h-5 text-accent-primary" />}
            label="Unique Holders"
            value="12,847"
            trend={{ value: "324", positive: true }}
            delay={100}
          />
          <MetricCard
            icon={<Clock className="w-5 h-5 text-accent-primary" />}
            label="Current Epoch"
            value="127"
            delay={200}
          />
          <MetricCard
            icon={<Zap className="w-5 h-5 text-accent-primary" />}
            label="Avg. Epoch Rewards"
            value="6.67"
            suffix="SOL"
            delay={300}
          />
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-heading-md">Distribution History</h3>
              <p className="text-body-sm text-text-muted">Last 30 epochs</p>
            </div>
            <div className="badge-accent">
              +23.4% growth
            </div>
          </div>
          <SpringChart
            data={[4.2, 5.1, 4.8, 6.2, 5.5, 7.1, 6.3, 7.8, 6.9, 8.2, 7.4, 8.9]}
            variant="area"
            height={200}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Merkle-Verified Claims",
      description: "Every reward allocation is cryptographically verifiable. Download proofs and validate independently.",
    },
    {
      icon: Clock,
      title: "Automated Epochs",
      description: "48-hour distribution cycles. No manual intervention required. Fully autonomous operation.",
    },
    {
      icon: Lock,
      title: "Non-Custodial",
      description: "Your rewards stay on-chain until you claim. No centralized custody, no counterparty risk.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track distributions, holder statistics, and protocol health with comprehensive dashboards.",
    },
    {
      icon: Zap,
      title: "Gas Optimized",
      description: "Batch processing and efficient smart contracts minimize transaction costs for all participants.",
    },
    {
      icon: Users,
      title: "Fair Distribution",
      description: "Proportional rewards based on verified token holdings. Transparent allocation algorithms.",
    },
  ];

  return (
    <section className="section">
      <div className="container-default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-caption text-accent-primary uppercase tracking-wider mb-4">
            Core Features
          </p>
          <h2 className="text-display-md mb-4">
            Enterprise-Grade Infrastructure
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Built for reliability, transparency, and scale. Every component 
            designed with institutional requirements in mind.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-interactive group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-5 transition-colors group-hover:bg-accent-primary/20">
                <feature.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-heading-md mb-3">{feature.title}</h3>
              <p className="text-body-md text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "LP Fees Accumulate",
      description: "Trading activity generates fees that flow to the protocol treasury automatically.",
    },
    {
      number: "02", 
      title: "Epoch Processing",
      description: "Every 48 hours, holdings are snapshotted and allocations calculated.",
    },
    {
      number: "03",
      title: "Merkle Root Published",
      description: "Cryptographic proof of all allocations published on-chain for verification.",
    },
    {
      number: "04",
      title: "Claim Anytime",
      description: "Submit your proof and claim rewards directly to your wallet.",
    },
  ];

  return (
    <section id="how-it-works" className="section bg-section-gradient">
      <div className="container-default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-caption text-accent-primary uppercase tracking-wider mb-4">
            Process
          </p>
          <h2 className="text-display-md mb-4">
            How It Works
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            A transparent, verifiable process from fee generation to reward distribution.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center lg:text-left"
              >
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-tertiary border border-border-default mb-6">
                  <span className="text-accent-primary font-mono font-semibold">
                    {step.number}
                  </span>
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-full bg-accent-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-heading-md mb-3">{step.title}</h3>
                <p className="text-body-md text-text-secondary">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TRUST SECTION
// ============================================
function TrustSection() {
  const trustItems = [
    {
      icon: CheckCircle,
      title: "Audited Smart Contracts",
      description: "Independent security audits ensure protocol integrity and safety.",
    },
    {
      icon: CheckCircle,
      title: "Open Source",
      description: "All code is publicly available for review and verification.",
    },
    {
      icon: CheckCircle,
      title: "Immutable Records",
      description: "Every transaction and allocation recorded permanently on Solana.",
    },
  ];

  return (
    <section className="section">
      <div className="container-default">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caption text-accent-primary uppercase tracking-wider mb-4">
              Trust & Security
            </p>
            <h2 className="text-display-md mb-6">
              Built for Institutional Confidence
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              We understand that trust is earned through transparency, security, 
              and consistent performance. Our infrastructure is designed to meet 
              the highest standards.
            </p>

            <div className="space-y-6">
              {trustItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-accent-primary" />
                  </div>
                  <div>
                    <h4 className="text-heading-md mb-1">{item.title}</h4>
                    <p className="text-body-md text-text-secondary">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-accent p-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/20 mb-6">
                <Shield className="w-8 h-8 text-accent-primary" />
              </div>
              <h3 className="text-heading-lg mb-4">Security First</h3>
              <p className="text-body-md text-text-secondary mb-8">
                Our contracts have been audited by leading security firms. 
                View full audit reports and verify contract addresses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="#" className="btn-secondary">
                  View Audit Reports
                </a>
                <a href="#" className="btn-ghost">
                  Contract Addresses
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  return (
    <section className="section">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative card gradient-border text-center py-16 px-8"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-radial from-accent-primary/5 via-transparent to-transparent rounded-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-display-md mb-4">
              Ready to View Your <span className="text-gradient">Rewards</span>?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8 max-w-lg mx-auto">
              Connect your wallet or enter any address to check earnings, 
              view epoch history, and claim your SOL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/earnings" className="btn-primary btn-lg group">
                Open Dashboard
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/epochs" className="btn-secondary btn-lg">
                View Epoch History
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-border-default">
      <div className="container-default">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary" />
              <span className="font-display font-bold text-xl">EpochOS</span>
            </div>
            <p className="text-body-md text-text-secondary max-w-md mb-6">
              Enterprise-grade token distribution infrastructure for the Solana ecosystem. 
              Transparent, verifiable, and built for scale.
            </p>
            <div className="flex items-center gap-2 text-body-sm text-text-muted">
              <span>Distributor:</span>
              <code className="text-accent-primary font-mono">Distr...XXX</code>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-heading-md mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/earnings" className="nav-link">Dashboard</Link></li>
              <li><Link href="/epochs" className="nav-link">Epochs</Link></li>
              <li><a href="#" className="nav-link">Documentation</a></li>
              <li><a href="#" className="nav-link">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-heading-md mb-4">Community</h4>
            <ul className="space-y-3">
              <li><a href="#" className="nav-link">Discord</a></li>
              <li><a href="#" className="nav-link">Twitter</a></li>
              <li><a href="#" className="nav-link">GitHub</a></li>
              <li><a href="#" className="nav-link">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-text-muted">
            © 2024 EpochOS. All rights reserved.
          </p>
          <div className="flex gap-6 text-body-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
