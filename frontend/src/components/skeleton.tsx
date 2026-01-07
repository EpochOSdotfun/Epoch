'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />;
}

// Dashboard KPI skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton h-3 w-16 mb-3" />
            <div className="skeleton h-8 w-24 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-surface-100">
          <div className="skeleton h-5 w-32" />
        </div>
        <div className="divide-y divide-surface-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="skeleton h-4 w-12" />
              <div className="skeleton h-4 w-24" />
              <div className="flex-1">
                <div className="skeleton h-1.5 w-full max-w-[120px]" />
              </div>
              <div className="skeleton h-4 w-16 hidden md:block" />
              <div className="skeleton h-4 w-20 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Earnings page skeleton
export function EarningsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton h-3 w-20 mb-4" />
            <div className="skeleton h-8 w-28 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Claim Banner */}
      <div className="card-padded">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-5 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="px-5 py-4">
          <div className="skeleton h-5 w-36 mb-6" />
        </div>
        <div className="divide-y divide-surface-50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="skeleton h-4 w-8" />
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-6 w-16 rounded" />
              <div className="flex-1" />
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

