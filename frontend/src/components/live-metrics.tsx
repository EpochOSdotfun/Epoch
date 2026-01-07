'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Flame, Clock } from 'lucide-react';
import { formatSol, formatNumber, cn } from '@/lib/utils';

interface Metrics {
  totalDistributed: string;
  totalBurned: string;
  holderCount: number;
  currentEpoch: number;
}

interface LiveMetricsProps {
  metrics?: Metrics;
  isLoading?: boolean;
}

export function LiveMetrics({ metrics, isLoading }: LiveMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="Distributed"
        value={metrics ? `${formatSol(metrics.totalDistributed)} SOL` : '-'}
        icon={TrendingUp}
        isLoading={isLoading}
        delay={0}
      />
      <MetricCard
        label="Holders"
        value={metrics ? formatNumber(metrics.holderCount) : '-'}
        icon={Users}
        isLoading={isLoading}
        delay={1}
      />
      <MetricCard
        label="Burned"
        value={metrics ? formatNumber(metrics.totalBurned) : '-'}
        icon={Flame}
        isLoading={isLoading}
        delay={2}
      />
      <MetricCard
        label="Current Epoch"
        value={metrics ? `#${metrics.currentEpoch}` : '-'}
        icon={Clock}
        accent
        isLoading={isLoading}
        delay={3}
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  isLoading?: boolean;
  delay?: number;
}

function MetricCard({ label, value, icon: Icon, accent, isLoading, delay = 0 }: MetricCardProps) {
  const [counted, setCounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || counted) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setCounted(true), delay * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, counted, delay]);

  return (
    <div
      ref={cardRef}
      className="card-padded"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-ink-300" />
        <span className="text-caption text-ink-500 uppercase tracking-wider">{label}</span>
      </div>
      {isLoading ? (
        <div className="skeleton h-6 w-20" />
      ) : (
        <p
          className={cn(
            'text-title-sm font-semibold tabular-nums',
            accent ? 'text-accent' : 'text-ink-900',
            counted ? 'animate-count-up' : 'opacity-0'
          )}
        >
          {value}
        </p>
      )}
    </div>
  );
}

