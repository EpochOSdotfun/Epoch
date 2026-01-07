'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatSol, formatDate, cn } from '@/lib/utils';

interface EpochBreakdownItem {
  epochId: number;
  amount: string;
  claimed: boolean;
  date: string;
}

interface EpochBreakdownProps {
  epochs: EpochBreakdownItem[];
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
    <div className="space-y-2">
      {epochs.map((epoch) => (
        <div
          key={epoch.epochId}
          className={cn(
            'flex items-center justify-between p-4 rounded-lg border transition-colors duration-180',
            epoch.claimed 
              ? 'border-surface-100 bg-bg-tertiary/50' 
              : 'border-accent/20 bg-accent-subtle'
          )}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-body-sm font-medium text-ink-900">
              #{epoch.epochId}
            </span>
            <span className="text-body-sm text-ink-700">
              {formatSol(epoch.amount)} SOL
            </span>
            <span className={cn(
              'badge',
              epoch.claimed ? 'badge-positive' : 'badge-warning'
            )}>
              {epoch.claimed ? 'Claimed' : 'Pending'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-caption text-ink-500 hidden sm:block">
              {formatDate(epoch.date)}
            </span>
            <Link
              href={`/epoch/${epoch.epochId}`}
              className="btn-ghost btn-sm p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
