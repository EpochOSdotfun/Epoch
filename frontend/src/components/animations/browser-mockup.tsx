'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface BrowserMockupProps {
  children?: ReactNode;
  url?: string;
  className?: string;
  enableGlow?: boolean;
}

/**
 * BrowserMockup - Dashboard preview with animated glow on hover
 * 
 * Motion Guidelines:
 * - Glow effect appears smoothly on hover (300ms ease)
 * - Subtle radial gradient emanates from center
 * - Shadow depth increases on hover
 * - Content can be animated separately
 */
export function BrowserMockup({ 
  children, 
  url = 'app.epochos.io/dashboard',
  className = '',
  enableGlow = true
}: BrowserMockupProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glow effect layer */}
      {enableGlow && (
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.95,
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: `radial-gradient(ellipse at center, rgba(63, 182, 139, 0.15) 0%, transparent 60%)`,
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* Browser frame */}
      <motion.div
        className="relative bg-bg-secondary rounded-xl overflow-hidden border border-border-default"
        animate={{
          boxShadow: isHovered 
            ? '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(63, 182, 139, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          borderColor: isHovered 
            ? 'rgba(63, 182, 139, 0.3)' 
            : 'rgba(255, 255, 255, 0.08)',
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Browser header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-bg-tertiary border-b border-border-default">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>

          {/* URL bar */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-primary/50 rounded-lg border border-border-subtle max-w-md w-full">
              <LockIcon className="w-3 h-3 text-accent-primary" />
              <span className="text-body-sm text-text-muted truncate">{url}</span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="w-14" />
        </div>

        {/* Browser content */}
        <div className="relative bg-bg-primary">
          {children || <DefaultDashboardPreview />}
        </div>
      </motion.div>

      {/* Reflection effect */}
      <div 
        className="absolute -bottom-8 left-4 right-4 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(63, 182, 139, 0.05) 0%, transparent 100%)',
          filter: 'blur(10px)',
          transform: 'scaleY(-0.3)',
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-.5V4.5A3.5 3.5 0 0 0 8 1zm2 5V4.5a2 2 0 1 0-4 0V6h4z"/>
    </svg>
  );
}

/**
 * DefaultDashboardPreview - Placeholder dashboard content
 */
function DefaultDashboardPreview() {
  return (
    <div className="p-6 space-y-4" style={{ minHeight: 300 }}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-8 h-8 rounded-lg bg-accent-primary/20"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-bg-elevated rounded" />
            <div className="h-2 w-16 bg-bg-tertiary rounded" />
          </div>
        </div>
        <div className="h-8 w-28 bg-accent-primary/10 rounded-lg border border-accent-primary/20" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="p-4 bg-bg-secondary/50 rounded-xl border border-border-subtle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          >
            <div className="h-2 w-16 bg-bg-tertiary rounded mb-3" />
            <div className="h-6 w-20 bg-bg-elevated rounded mb-1" />
            <div className="h-2 w-12 bg-bg-tertiary rounded" />
          </motion.div>
        ))}
      </div>

      {/* Chart skeleton */}
      <motion.div
        className="p-4 bg-bg-secondary/50 rounded-xl border border-border-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="h-3 w-32 bg-bg-tertiary rounded mb-4" />
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-accent-primary/20 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ 
                delay: 0.6 + i * 0.05, 
                duration: 0.6,
                ease: [0.34, 1.2, 0.64, 1]
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Table skeleton */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="flex items-center gap-4 p-3 bg-bg-secondary/30 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-bg-elevated" />
            <div className="flex-1 h-2 bg-bg-tertiary rounded" />
            <div className="w-16 h-2 bg-bg-tertiary rounded" />
            <div className="w-12 h-6 bg-accent-primary/10 rounded" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * DashboardPreviewContent - Actual dashboard preview with real-looking data
 */
export function DashboardPreviewContent() {
  return (
    <div className="p-4 space-y-4" style={{ minHeight: 320 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary" />
          <span className="font-display font-semibold text-sm">Epoch Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-accent-primary">●</span>
          <span className="text-caption text-text-muted">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div 
          className="p-3 bg-bg-secondary/60 rounded-lg border border-border-subtle"
          whileHover={{ borderColor: 'rgba(63, 182, 139, 0.3)' }}
        >
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Earned</p>
          <p className="text-lg font-semibold text-text-primary">12.847 <span className="text-text-muted text-xs">SOL</span></p>
        </motion.div>
        <motion.div 
          className="p-3 bg-bg-secondary/60 rounded-lg border border-border-subtle"
          whileHover={{ borderColor: 'rgba(63, 182, 139, 0.3)' }}
        >
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Unclaimed</p>
          <p className="text-lg font-semibold text-accent-primary">2.613 <span className="text-text-muted text-xs">SOL</span></p>
        </motion.div>
        <motion.div 
          className="p-3 bg-bg-secondary/60 rounded-lg border border-border-subtle"
          whileHover={{ borderColor: 'rgba(63, 182, 139, 0.3)' }}
        >
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Current Epoch</p>
          <p className="text-lg font-semibold text-text-primary">#127</p>
        </motion.div>
      </div>

      {/* Mini chart */}
      <div className="p-3 bg-bg-secondary/40 rounded-lg border border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Earnings History</p>
          <p className="text-[10px] text-accent-primary">+23.4%</p>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[35, 48, 42, 58, 52, 68, 55, 72, 65, 78, 70, 82].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-accent-primary/30 rounded-t"
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.03, duration: 0.4, ease: [0.34, 1.1, 0.64, 1] }}
            />
          ))}
        </div>
      </div>

      {/* Recent epochs */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-text-muted uppercase tracking-wider px-1">Recent Epochs</p>
        {[
          { id: 127, amount: '0.892', status: 'unclaimed' },
          { id: 126, amount: '0.956', status: 'unclaimed' },
          { id: 125, amount: '0.765', status: 'claimed' },
        ].map((epoch, i) => (
          <motion.div
            key={epoch.id}
            className="flex items-center gap-3 p-2 bg-bg-secondary/30 rounded-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <span className="text-xs font-mono text-text-muted">#{epoch.id}</span>
            <span className="flex-1 text-xs font-medium">{epoch.amount} SOL</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              epoch.status === 'unclaimed' 
                ? 'bg-accent-primary/10 text-accent-primary'
                : 'bg-bg-elevated text-text-muted'
            }`}>
              {epoch.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BrowserMockup;

