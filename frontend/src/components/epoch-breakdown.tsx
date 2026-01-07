'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatSol } from '@/lib/utils';

interface EpochBreakdownProps {
  epochs: Array<{
    epochId: number;
    amount: string;
    claimed: boolean;
    date: string;
  }>;
}

export function EpochBreakdown({ epochs }: EpochBreakdownProps) {
  if (!epochs || epochs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-body-sm text-ink-500">No epoch data available</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-100">
      {epochs.map((epoch) => (
        <div
          key={epoch.epochId}
          className="flex items-center justify-between py-3 px-1 hover:bg-surface-50 -mx-1 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-body-sm font-medium text-ink-900 w-16">
              #{epoch.epochId}
            </span>
            <span className="mono-value">
              {formatSol(epoch.amount)} SOL
            </span>
          </div>

          <div className="flex items-center gap-4">
            {epoch.claimed ? (
              <span className="badge-positive">Claimed</span>
            ) : (
              <span className="badge-warning">Pending</span>
            )}
            <span className="text-caption text-ink-500 w-20 text-right">
              {new Date(epoch.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <Link
              href={`/epoch/${epoch.epochId}`}
              className="text-ink-300 hover:text-ink-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
