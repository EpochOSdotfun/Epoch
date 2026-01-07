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
      value: metrics ? formatSol(metrics.totalDistributed) + ' SOL' : '—',
      icon: TrendingUp,
    },
    {
      label: 'Liquidity',
      value: metrics ? formatCurrency(parseFloat(metrics.liquidity) / 1e9) : '—',
      icon: Droplets,
    },
    {
      label: '24h Volume',
      value: metrics ? formatCurrency(parseFloat(metrics.volume24h) / 1e9) : '—',
      icon: BarChart3,
    },
    {
      label: 'Total Burned',
      value: metrics ? formatNumber(metrics.totalBurned) : '—',
      icon: Flame,
    },
    {
      label: 'Holders',
      value: metrics ? formatNumber(metrics.holderCount) : '—',
      icon: Users,
    },
    {
      label: 'Current Epoch',
      value: metrics ? `#${metrics.currentEpoch}` : '—',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div key={item.label} className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-md bg-surface-100">
              <item.icon className="w-4 h-4 text-ink-500" />
            </div>
          </div>
          {isLoading ? (
            <div className="skeleton h-7 w-20" />
          ) : (
            <div className="kpi-value text-lg">{item.value}</div>
          )}
          <div className="kpi-sublabel mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
