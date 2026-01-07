'use client';

import { useEffect, useState } from 'react';

export function DashboardPreview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`card-transparent transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-dim)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="label mb-0">Live Dashboard</span>
        </div>
        <span className="mono text-[var(--text-muted)]">Epoch #127</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-2">Total Distributed</div>
          <div className="text-2xl font-light">
            <span className="text-[var(--text-primary)]">1,247.82</span>
            <span className="text-sm text-[var(--text-muted)] ml-1">SOL</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-2">Tokens Burned</div>
          <div className="text-2xl font-light">
            <span className="text-[var(--text-primary)]">892K</span>
            <span className="text-sm text-[var(--text-muted)] ml-1">🔥</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-2">Unique Holders</div>
          <div className="text-2xl font-light text-[var(--text-primary)]">4,219</div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-2">Claim Rate</div>
          <div className="text-2xl font-light">
            <span className="text-accent">89%</span>
          </div>
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="mb-6">
        <div className="text-xs text-[var(--text-muted)] mb-4">Last 7 Epochs (SOL)</div>
        <div className="flex items-end gap-2 h-20">
          {[45, 62, 58, 71, 64, 82, 78].map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-[var(--accent)] transition-all duration-500"
              style={{
                height: `${value}%`,
                opacity: mounted ? 0.2 + (i * 0.1) : 0,
                transitionDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)]">
          <span>121</span>
          <span>127</span>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="pt-6 border-t border-[var(--border-dim)]">
        <div className="text-xs text-[var(--text-muted)] mb-4">Current Allocation</div>
        <div className="space-y-3">
          <AllocationRow label="Holder Rewards" value={50} />
          <AllocationRow label="Buyback & Burn" value={30} />
          <AllocationRow label="Auto LP" value={20} />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-6 pt-6 border-t border-[var(--border-dim)]">
        <div className="text-xs text-[var(--text-muted)] mb-4">Recent Activity</div>
        <div className="space-y-3">
          <ActivityItem
            type="claim"
            address="7xKp...3nVq"
            amount="2.45 SOL"
            time="2m ago"
          />
          <ActivityItem
            type="burn"
            amount="12,450 tokens"
            time="5m ago"
          />
          <ActivityItem
            type="claim"
            address="9bMz...8wPx"
            amount="0.89 SOL"
            time="8m ago"
          />
        </div>
      </div>
    </div>
  );
}

function AllocationRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[var(--bg-primary)] overflow-hidden">
        <div
          className="h-full bg-[var(--accent)]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-[var(--text-secondary)] w-20">{label}</span>
      <span className="text-xs text-[var(--text-muted)] w-8 text-right">{value}%</span>
    </div>
  );
}

function ActivityItem({
  type,
  address,
  amount,
  time,
}: {
  type: 'claim' | 'burn';
  address?: string;
  amount: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            type === 'claim' ? 'bg-[var(--accent)]' : 'bg-orange-500'
          }`}
        />
        <span className="text-[var(--text-secondary)]">
          {type === 'claim' ? `${address} claimed` : 'Burned'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[var(--text-primary)]">{amount}</span>
        <span className="text-[var(--text-muted)]">{time}</span>
      </div>
    </div>
  );
}

