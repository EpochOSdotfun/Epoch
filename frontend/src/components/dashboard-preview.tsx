'use client';

import { useRef, useEffect } from 'react';
import { formatSol, formatNumber } from '@/lib/utils';

interface DashboardPreviewProps {
  metrics?: {
    totalDistributed: string;
    currentEpoch: number;
    holderCount: number;
    treasuryBalance: string;
  };
  className?: string;
}

// Mock data for the preview
const mockEpochs = [
  { id: 47, rewards: '12.453', claimed: 78, claimants: 342 },
  { id: 46, rewards: '11.892', claimed: 92, claimants: 328 },
  { id: 45, rewards: '13.214', claimed: 100, claimants: 315 },
  { id: 44, rewards: '10.567', claimed: 100, claimants: 301 },
];

export function DashboardPreview({ metrics, className }: DashboardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect on scroll (respects reduced motion)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const translate = Math.max(0, Math.min(20, scrollProgress * 40 - 10));
      containerRef.current.style.transform = `translateY(${-translate}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {/* Dashboard Container - looks like an actual app window */}
      <div className="bg-bg-secondary border border-surface-100 rounded-xl overflow-hidden shadow-lg">
        {/* Window Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-bg-tertiary border-b border-surface-100">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-surface-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-surface-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-surface-200" />
          </div>
          <span className="text-caption text-ink-300 ml-2">Epoch Dashboard</span>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 space-y-5">
          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-tertiary rounded-lg p-3">
              <span className="text-caption-sm text-ink-300 uppercase tracking-wider">Distributed</span>
              <p className="text-title-sm font-semibold text-ink-900 mt-1 tabular-nums">
                {metrics ? formatSol(metrics.totalDistributed) : '1,234.56'} SOL
              </p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-3">
              <span className="text-caption-sm text-ink-300 uppercase tracking-wider">Epoch</span>
              <p className="text-title-sm font-semibold text-accent mt-1 tabular-nums">
                #{metrics?.currentEpoch || 47}
              </p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-3">
              <span className="text-caption-sm text-ink-300 uppercase tracking-wider">Holders</span>
              <p className="text-title-sm font-semibold text-ink-900 mt-1 tabular-nums">
                {metrics ? formatNumber(metrics.holderCount) : '4,521'}
              </p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-3">
              <span className="text-caption-sm text-ink-300 uppercase tracking-wider">Treasury</span>
              <p className="text-title-sm font-semibold text-ink-900 mt-1 tabular-nums">
                {metrics ? formatSol(metrics.treasuryBalance) : '23.45'} SOL
              </p>
            </div>
          </div>

          {/* Mini Table */}
          <div className="bg-bg-tertiary rounded-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-surface-100">
              <span className="text-caption text-ink-500">Recent Epochs</span>
            </div>
            <div className="divide-y divide-surface-50">
              {mockEpochs.map((epoch) => (
                <div key={epoch.id} className="flex items-center justify-between px-3 py-2.5 text-caption">
                  <span className="font-mono text-ink-700">#{epoch.id}</span>
                  <span className="text-ink-500 tabular-nums">{epoch.rewards} SOL</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-surface-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full" 
                        style={{ width: `${epoch.claimed}%` }} 
                      />
                    </div>
                    <span className="text-ink-300 tabular-nums w-8">{epoch.claimed}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

