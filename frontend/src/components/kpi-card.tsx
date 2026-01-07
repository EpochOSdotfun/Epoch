'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  delta?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
  };
  variant?: 'default' | 'highlight' | 'accent';
  className?: string;
}

export function KPICard({
  label,
  value,
  sublabel,
  delta,
  variant = 'default',
  className,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevValue = useRef(value);

  // Count-up animation for numeric values
  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayValue(value);
        setAnimating(false);
      }, 50);
      prevValue.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div
      className={cn(
        'kpi-card',
        variant === 'highlight' && 'border-accent/20 bg-accent-subtle',
        variant === 'accent' && 'border-accent/30',
        className
      )}
    >
      <p className="kpi-label">{label}</p>
      <p
        className={cn(
          'kpi-value',
          variant === 'accent' && 'kpi-value-accent',
          animating && 'animate-count-up'
        )}
      >
        {displayValue}
      </p>
      {(sublabel || delta) && (
        <div className="flex items-center gap-2 mt-1">
          {sublabel && <span className="kpi-sublabel">{sublabel}</span>}
          {delta && (
            <span
              className={cn(
                'kpi-delta',
                delta.type === 'positive' && 'kpi-delta-positive',
                delta.type === 'negative' && 'kpi-delta-negative'
              )}
            >
              {delta.type === 'positive' && '↑'}
              {delta.type === 'negative' && '↓'}
              {delta.value}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Skeleton version
export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('kpi-card', className)}>
      <div className="skeleton h-3 w-16 mb-3" />
      <div className="skeleton h-7 w-24 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

