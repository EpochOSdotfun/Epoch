'use client';

import { TrendingUp, Droplets, BarChart3, Flame, Users, Clock } from 'lucide-react';
import { formatSol, formatNumber, formatCurrency } from '@/lib/utils';

interface Metrics {
  price: string | null;
  liquidity: string;
  volume24h: string;
  totalDistributed: string;
  totalBurned: string;
  holderCount: number;
  currentEpoch: number;
  treasuryBalance: string;
}

interface MetricsGridProps {
  metrics?: Metrics;
  isLoading: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  const items = [
    {
      label: 'Total Distributed',
      value: metrics ? formatSol(metrics.totalDistributed) + ' SOL' : '-',
      icon: TrendingUp,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    {
      label: 'Liquidity',
      value: metrics ? formatCurrency(parseFloat(metrics.liquidity) / 1e9) : '-',
      icon: Droplets,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
    },
    {
      label: '24h Volume',
      value: metrics ? formatCurrency(parseFloat(metrics.volume24h) / 1e9) : '-',
      icon: BarChart3,
      color: 'text-accent-warning',
      bgColor: 'bg-accent-warning/10',
    },
    {
      label: 'Total Burned',
      value: metrics ? formatNumber(metrics.totalBurned) : '-',
      icon: Flame,
      color: 'text-accent-error',
      bgColor: 'bg-accent-error/10',
    },
    {
      label: 'Holders',
      value: metrics ? formatNumber(metrics.holderCount) : '-',
      icon: Users,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    {
      label: 'Current Epoch',
      value: metrics ? `#${metrics.currentEpoch}` : '-',
      icon: Clock,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="card-hover"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 bg-bg-tertiary rounded animate-pulse" />
          ) : (
            <div className="text-xl font-bold truncate">{item.value}</div>
          )}
          <div className="text-xs text-text-muted mt-1 truncate">{item.label}</div>
        </div>
      ))}
    </div>
  );
}


