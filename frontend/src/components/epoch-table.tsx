'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ExternalLink, Download } from 'lucide-react';
import { formatSol, formatNumber, formatDate, formatRelativeTime, cn } from '@/lib/utils';

interface EpochRow {
  epochId: number;
  rewardsSol: string;
  claimedSol: string;
  numClaimants: number;
  totalAllocations?: number;
  publishedAt: string;
  publishSig?: string | null;
  merkleRoot?: string;
}

interface EpochTableProps {
  epochs: EpochRow[];
  showExpand?: boolean;
  isLoading?: boolean;
}

export function EpochTable({ epochs, showExpand = true, isLoading }: EpochTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return <EpochTableSkeleton />;
  }

  if (!epochs || epochs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body-sm text-ink-500">No epochs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="w-12"></th>
            <th>Epoch</th>
            <th>Rewards</th>
            <th>Claimed</th>
            <th className="hidden md:table-cell">Claimants</th>
            <th className="hidden md:table-cell">Published</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {epochs.map((epoch) => {
            const claimPercent =
              Number(epoch.rewardsSol) > 0
                ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol)) * 100
                : 0;
            const isExpanded = expandedId === epoch.epochId;

            return (
              <>
                <tr
                  key={epoch.epochId}
                  className={cn(
                    'transition-colors duration-180',
                    showExpand && 'cursor-pointer',
                    isExpanded && 'bg-bg-tertiary'
                  )}
                  onClick={() => showExpand && setExpandedId(isExpanded ? null : epoch.epochId)}
                >
                  <td className="pr-0">
                    {showExpand && (
                      <button className="p-1 text-ink-300 hover:text-ink-700">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </td>
                  <td>
                    <span className="font-mono font-medium text-ink-900">#{epoch.epochId}</span>
                  </td>
                  <td>
                    <span className="mono-value">{formatSol(epoch.rewardsSol)} SOL</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${Math.min(claimPercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-caption text-ink-500 tabular-nums">
                        {claimPercent.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-ink-500">
                    {formatNumber(epoch.numClaimants)}
                    {epoch.totalAllocations && (
                      <span className="text-ink-300"> / {formatNumber(epoch.totalAllocations)}</span>
                    )}
                  </td>
                  <td className="hidden md:table-cell text-ink-500">
                    {formatRelativeTime(epoch.publishedAt)}
                  </td>
                  <td>
                    <Link
                      href={`/epoch/${epoch.epochId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn-ghost btn-sm p-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>

                {/* Expanded Row */}
                {isExpanded && showExpand && (
                  <tr className="bg-bg-tertiary">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="pl-8 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm">
                          <div>
                            <span className="text-ink-500">Merkle Root</span>
                            <code className="block mt-1 font-mono text-mono text-ink-700 break-all">
                              {epoch.merkleRoot || 'N/A'}
                            </code>
                          </div>
                          <div>
                            <span className="text-ink-500">Published</span>
                            <p className="mt-1 text-ink-700">{formatDate(epoch.publishedAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          {epoch.publishSig && (
                            <a
                              href={`https://solscan.io/tx/${epoch.publishSig}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-ghost btn-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View TX
                            </a>
                          )}
                          <a
                            href={`/api/epochs/${epoch.epochId}/csv`}
                            download
                            className="btn-ghost btn-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-3 h-3" />
                            CSV
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EpochTableSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 px-4">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-2 w-16" />
          <div className="flex-1" />
          <div className="skeleton h-4 w-16 hidden md:block" />
          <div className="skeleton h-4 w-20 hidden md:block" />
        </div>
      ))}
    </div>
  );
}

