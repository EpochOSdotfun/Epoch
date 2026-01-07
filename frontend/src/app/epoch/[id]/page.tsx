'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Download, Copy, Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useEpoch } from '@/hooks/useEpoch';
import { formatSol, formatNumber, formatDate, cn } from '@/lib/utils';
import { Tooltip, tooltipContent } from '@/components/tooltip';

export default function EpochPage() {
  const params = useParams();
  const epochId = params.id as string;
  const { data: epoch, isLoading, error } = useEpoch(parseInt(epochId));
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container-main py-8">
          <div className="skeleton h-8 w-24 mb-6" />
          <div className="skeleton h-10 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !epoch) {
    return (
      <div className="min-h-screen">
        <div className="container-main py-8">
          <Link href="/epochs" className="btn-ghost btn-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Epochs
          </Link>
          <div className="card text-center py-12 max-w-md mx-auto">
            <h2 className="text-body font-semibold mb-2">Epoch not found</h2>
            <p className="text-caption text-text-muted">
              Epoch #{epochId} does not exist or hasn't been published yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const claimPercent = epoch.claimProgress || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border-default">
        <div className="container-main py-8">
          <Link href="/epochs" className="btn-ghost btn-sm mb-4 -ml-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Epochs
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-heading font-semibold text-text-primary mb-1">
                Epoch #{epoch.epochId}
              </h1>
              <p className="text-caption text-text-muted">
                Published {formatDate(epoch.publishedAt)}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`/api/epochs/${epoch.epochId}/csv`}
                className="btn-secondary btn-sm"
                download
              >
                <Download className="w-4 h-4" />
                Download CSV
              </a>
              {epoch.publishSig && (
                <a
                  href={`https://solscan.io/tx/${epoch.publishSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost btn-sm"
                >
                  View on Solscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-main py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="kpi-card">
            <div className="kpi-value">{formatSol(epoch.rewardsSol)}</div>
            <div className="kpi-label">Total Rewards (SOL)</div>
          </div>
          <div className="kpi-card">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                'kpi-value',
                claimPercent >= 100 ? 'text-accent-success' : ''
              )}>
                {claimPercent.toFixed(1)}%
              </span>
            </div>
            <div className="kpi-label">Claimed</div>
            <div className="mt-2 w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  claimPercent >= 100 ? 'bg-accent-success' : 'bg-accent-primary'
                )}
                style={{ width: `${Math.min(claimPercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-value">
              {formatNumber(epoch.numClaimants)}
              <span className="text-body text-text-muted font-normal">
                {' '}/ {formatNumber(epoch.totalAllocations)}
              </span>
            </div>
            <div className="kpi-label">Claimants</div>
          </div>
          <div className="kpi-card">
            <div className="text-body font-medium mono">
              {formatNumber(epoch.startSlot)}
            </div>
            <div className="text-body font-medium mono text-text-muted">
              → {formatNumber(epoch.endSlot)}
            </div>
            <div className="kpi-label mt-2">
              <Tooltip content={tooltipContent.epochSlot}>
                <span className="inline-flex items-center gap-1 cursor-help">
                  Slot Range
                  <HelpCircle className="w-3 h-3" />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="card">
          <h2 className="text-body font-semibold mb-4">Verification Data</h2>
          
          <div className="space-y-4">
            {/* Merkle Root */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-caption">Merkle Root</span>
                <Tooltip content={tooltipContent.merkleRoot}>
                  <HelpCircle className="w-3 h-3 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <code className="mono text-caption bg-bg-secondary px-2 py-1 rounded break-all">
                  {epoch.merkleRoot}
                </code>
                <button
                  onClick={() => copyToClipboard(epoch.merkleRoot, 'merkle')}
                  className="btn-ghost p-1.5 shrink-0"
                >
                  {copiedField === 'merkle' ? (
                    <Check className="w-3.5 h-3.5 text-accent-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* CSV Hash */}
            {epoch.csvHash && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 border-b border-border-default">
                <span className="text-text-muted text-caption">CSV Hash (SHA-256)</span>
                <div className="flex items-center gap-2">
                  <code className="mono text-caption bg-bg-secondary px-2 py-1 rounded break-all">
                    {epoch.csvHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(epoch.csvHash!, 'csv')}
                    className="btn-ghost p-1.5 shrink-0"
                  >
                    {copiedField === 'csv' ? (
                      <Check className="w-3.5 h-3.5 text-accent-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Publish Signature */}
            {epoch.publishSig && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3">
                <span className="text-text-muted text-caption">Publish Transaction</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://solscan.io/tx/${epoch.publishSig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-caption link inline-flex items-center gap-1"
                  >
                    {epoch.publishSig.slice(0, 24)}...
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(epoch.publishSig!, 'sig')}
                    className="btn-ghost p-1.5 shrink-0"
                  >
                    {copiedField === 'sig' ? (
                      <Check className="w-3.5 h-3.5 text-accent-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
