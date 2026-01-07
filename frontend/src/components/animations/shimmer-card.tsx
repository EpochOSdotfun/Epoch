'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * ShimmerCard - Metrics card with one-time shimmer animation on load
 * 
 * Motion Guidelines:
 * - Single pass shimmer effect (600ms)
 * - Triggers once when card enters viewport
 * - Soft, subtle highlight sweep
 * - Never repeats to avoid distraction
 */
export function ShimmerCard({ 
  children, 
  className = '',
  delay = 0 
}: ShimmerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Mark animation as complete after it runs
  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 600 + delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-bg-secondary/60 backdrop-blur-sm border border-border-default ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: delay / 1000,
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Card content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Shimmer overlay - one time only */}
      {isInView && !hasAnimated && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ 
            duration: 0.6, 
            delay: delay / 1000,
            ease: [0.4, 0, 0.2, 1] 
          }}
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(63, 182, 139, 0.04) 20%,
              rgba(63, 182, 139, 0.1) 50%,
              rgba(63, 182, 139, 0.04) 80%,
              transparent 100%
            )`,
          }}
        />
      )}

      {/* Subtle inner glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(63, 182, 139, 0.05) 0%, transparent 70%)',
          opacity: hasAnimated ? 1 : 0,
        }}
      />
    </motion.div>
  );
}

/**
 * MetricCard - Pre-styled shimmer card for dashboard metrics
 */
interface MetricCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  suffix?: string;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

export function MetricCard({ 
  icon, 
  label, 
  value, 
  suffix = '', 
  trend,
  delay = 0 
}: MetricCardProps) {
  return (
    <ShimmerCard delay={delay}>
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            {icon}
          </div>
        )}
        {trend && (
          <span className={`text-caption px-2 py-1 rounded-full ${
            trend.positive 
              ? 'bg-accent-primary/10 text-accent-primary' 
              : 'bg-accent-error/10 text-accent-error'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-caption text-text-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-display-md font-display tracking-tight">
        <span className="bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text">
          {value}
        </span>
        {suffix && <span className="text-text-muted ml-1">{suffix}</span>}
      </p>
    </ShimmerCard>
  );
}

export default ShimmerCard;

