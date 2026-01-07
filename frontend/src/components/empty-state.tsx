'use client';

import { Search, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  variant: 'no-wallet' | 'no-data' | 'no-epochs' | 'error';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const variants = {
  'no-wallet': {
    icon: Search,
    defaultTitle: 'Enter a Wallet Address',
    defaultDescription: 'Connect your wallet or enter any Solana address to view earnings and claim history.',
  },
  'no-data': {
    icon: Wallet,
    defaultTitle: 'No Earnings Found',
    defaultDescription: 'This wallet has no recorded earnings. Hold tokens to become eligible for rewards.',
  },
  'no-epochs': {
    icon: Calendar,
    defaultTitle: 'No Epochs Yet',
    defaultDescription: 'No epochs have been published yet. Check back soon.',
  },
  'error': {
    icon: AlertCircle,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'Unable to load data. Please try again.',
  },
};

export function EmptyState({
  variant,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn('text-center py-16 px-4', className)}>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-50 mb-5">
        <Icon className="w-5 h-5 text-ink-300" />
      </div>
      <h3 className="text-title-sm text-ink-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-body-sm text-ink-500 max-w-sm mx-auto">
        {description || config.defaultDescription}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

