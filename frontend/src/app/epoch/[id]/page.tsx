'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Hash, Users, Coins, ExternalLink, Download, 
  CheckCircle, ArrowLeft, Copy, Check, Shield, FileCheck 
} from 'lucide-react';
import { useState } from 'react';
import { useEpoch } from '@/hooks/useEpoch';
import { KPICard, KPICardSkeleton } from '@/components/kpi-card';
import { formatSol, formatNumber, formatDate, cn } from '@/lib/utils';

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
    return <EpochDetailSkeleton epochId={epochId} />;
  }

  if (error || !epoch) {
    return (
      <div className="page-fade min-h-screen">
        <header className="border-b border-surface-100 bg-bg-secondary/50">
          <div className="container-default py-6">
            <Link href="/epochs" className="btn-ghost btn-sm -ml-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Epochs
            </Link>
            <h1 className="text-h2 text-ink-900">Epoch Not Found</h1>
          </div>
        </header>
        <main className="container-default py-8">
          <div className="card-padded text-center py-16">
            <Calendar className="w-12 h-12 mx-auto text-ink-300 mb-4" />
            <h3 className="text-title-sm text-ink-900 mb-2">Epoch #{epochId} not found</h3>
            <p className="text-body-sm text-ink-500">
              This epoch may not exist or hasn't been published yet.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const claimPercent = epoch.claimProgress || 
    (Number(epoch.rewardsSol) > 0 
      ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol)) * 100 
      : 0);

  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-100 bg-bg-secondary/50">
        <div className="container-default py-6">
          <Link href="/epochs" className="btn-ghost btn-sm -ml-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Epochs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-h2 text-ink-900">Epoch #{epoch.epochId}</h1>
                <span className={cn(
                  'badge',
                  claimPercent >= 100 ? 'badge-positive' : 'badge-accent'
                )}>
                  {claimPercent >= 100 ? 'Complete' : 'Active'}
                </span>
              </div>
              <p className="text-body text-ink-500">
                Published {formatDate(epoch.publishedAt)}
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={`/api/epochs/${epoch.epochId}/csv`}
                download
                className="btn-secondary btn-sm"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </a>
              {epoch.publishSig && (
                <a
                  href={`https://solscan.io/tx/${epoch.publishSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary btn-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View TX
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-default py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            label="Total Rewards"
            value={`${formatSol(epoch.rewardsSol)} SOL`}
          />
          <KPICard
            label="Claimed"
            value={`${claimPercent.toFixed(1)}%`}
            sublabel={`${formatSol(epoch.claimedSol)} SOL`}
            variant={claimPercent >= 100 ? 'default' : 'accent'}
          />
          <KPICard
            label="Claimants"
            value={formatNumber(epoch.numClaimants)}
            sublabel={epoch.totalAllocations ? `of ${formatNumber(epoch.totalAllocations)}` : undefined}
          />
          <KPICard
            label="Slot Range"
            value={`${formatNumber(epoch.startSlot)} – ${formatNumber(epoch.endSlot)}`}
          />
        </div>

        {/* Claim Progress */}
        <div className="card-padded">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-title-sm text-ink-900">Claim Progress</h3>
            <span className="text-body-sm text-ink-500 tabular-nums">{claimPercent.toFixed(1)}%</span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(claimPercent, 100)}%` }} 
            />
          </div>
          <div className="flex justify-between mt-3 text-caption text-ink-500">
            <span>{formatSol(epoch.claimedSol)} SOL claimed</span>
            <span>{formatSol((Number(epoch.rewardsSol) - Number(epoch.claimedSol)).toString())} SOL remaining</span>
          </div>
        </div>

        {/* Verification Section */}
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-100">
            <h3 className="text-title-sm text-ink-900">Verification</h3>
          </div>
          
          <div className="divide-y divide-surface-50">
            {/* Merkle Root */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="checklist-icon checklist-icon-done mt-0.5">
                  <Shield className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-body-sm font-medium text-ink-900">Merkle Root</span>
                    <button
                      onClick={() => epoch.merkleRoot && copyToClipboard(epoch.merkleRoot, 'merkle')}
                      className="btn-ghost btn-sm p-1"
                    >
                      {copiedField === 'merkle' ? (
                        <Check className="w-3.5 h-3.5 text-positive" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <code className="block text-mono text-ink-500 break-all">
                    {epoch.merkleRoot || 'N/A'}
                  </code>
                </div>
              </div>
            </div>

            {/* CSV Hash */}
            {epoch.csvHash && (
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="checklist-icon checklist-icon-done mt-0.5">
                    <FileCheck className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-body-sm font-medium text-ink-900">CSV Hash (SHA-256)</span>
                      <button
                        onClick={() => copyToClipboard(epoch.csvHash!, 'csv')}
                        className="btn-ghost btn-sm p-1"
                      >
                        {copiedField === 'csv' ? (
                          <Check className="w-3.5 h-3.5 text-positive" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <code className="block text-mono text-ink-500 break-all">
                      {epoch.csvHash}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Publish Transaction */}
            {epoch.publishSig && (
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="checklist-icon checklist-icon-done mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-body-sm font-medium text-ink-900">Publish Transaction</span>
                      <a
                        href={`https://solscan.io/tx/${epoch.publishSig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost btn-sm p-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <code className="block text-mono text-ink-500 break-all">
                      {epoch.publishSig}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Verify */}
        <div className="card-padded bg-bg-secondary/50">
          <h4 className="text-body-sm font-medium text-ink-900 mb-3">How to verify your allocation</h4>
          <ol className="text-caption text-ink-500 space-y-2 list-decimal list-inside">
            <li>Download the CSV file above</li>
            <li>Find your wallet address and allocation amount</li>
            <li>Hash the CSV file with SHA-256 and compare to the hash above</li>
            <li>Use our SDK to generate your Merkle proof and verify against the root</li>
          </ol>
          <a href="/docs/verification" className="inline-flex items-center gap-1 text-caption text-accent mt-4 hover:underline">
            Read full verification guide
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>
    </div>
  );
}

function EpochDetailSkeleton({ epochId }: { epochId: string }) {
  return (
    <div className="page-fade min-h-screen">
      <header className="border-b border-surface-100 bg-bg-secondary/50">
        <div className="container-default py-6">
          <div className="skeleton h-5 w-24 mb-4" />
          <div className="skeleton h-9 w-48 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
      </header>
      <main className="container-default py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <KPICardSkeleton key={i} />
          ))}
        </div>
        <div className="card-padded">
          <div className="skeleton h-5 w-32 mb-4" />
          <div className="skeleton h-2 w-full mb-3" />
          <div className="flex justify-between">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="skeleton h-5 w-28" />
          </div>
          <div className="divide-y divide-surface-50">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-5 py-4">
                <div className="skeleton h-4 w-24 mb-2" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
