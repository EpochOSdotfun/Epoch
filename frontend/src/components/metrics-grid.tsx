'use client';

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
    },
    {
      label: 'Liquidity',
      value: metrics ? formatCurrency(parseFloat(metrics.liquidity) / 1e9) : '—',
    },
    {
      label: '24h Volume',
      value: metrics ? formatCurrency(parseFloat(metrics.volume24h) / 1e9) : '—',
    },
    {
      label: 'Total Burned',
      value: metrics ? formatNumber(metrics.totalBurned) : '—',
    },
    {
      label: 'Holders',
      value: metrics ? formatNumber(metrics.holderCount) : '—',
    },
    {
      label: 'Current Epoch',
      value: metrics ? `#${metrics.currentEpoch}` : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div key={item.label} className="kpi-card">
          {isLoading ? (
            <div className="skeleton h-7 w-24 mb-1" />
          ) : (
            <div className="text-body-lg font-semibold text-text-primary truncate">
              {item.value}
            </div>
          )}
          <div className="kpi-label truncate">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
