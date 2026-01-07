'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { formatSol, formatNumber, formatDate, cn } from '@/lib/utils';

interface Epoch {
  epochId: number;
  startSlot: string;
  endSlot: string;
  rewardsSol: string;
  rewardsToken: string;
  claimedSol: string;
  claimedToken: string;
  numClaimants: number;
  publishedAt: string;
  publishSig: string | null;
}

interface EpochsResponse {
  epochs: Epoch[];
  total: number;
  hasMore: boolean;
}

export default function EpochsPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading } = useQuery<EpochsResponse>({
    queryKey: ['epochs', page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs?limit=${limit}&offset=${page * limit}`
      );
      return res.json();
    },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border-default">
        <div className="container-main py-8">
          <h1 className="text-heading font-semibold text-text-primary mb-2">
            Epochs
          </h1>
          <p className="text-body text-text-secondary">
            Reward distribution history and claim progress.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-main py-8">
        {isLoading ? (
          <div className="card">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          </div>
        ) : data?.epochs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-text-muted">No epochs published yet.</p>
          </div>
        ) : (
          <div className="card p-0">
            <div className="table-container">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Epoch</th>
                    <th>Rewards</th>
                    <th>Progress</th>
                    <th className="hidden md:table-cell">Claimants</th>
                    <th className="hidden md:table-cell">Published</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.epochs.map((epoch) => {
                    const claimPercent =
                      BigInt(epoch.rewardsSol) > 0n
                        ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol)) * 100
                        : 0;

                    return (
                      <tr key={epoch.epochId}>
                        <td>
                          <Link
                            href={`/epoch/${epoch.epochId}`}
                            className="mono link font-medium"
                          >
                            #{epoch.epochId}
                          </Link>
                        </td>
                        <td>
                          <span className="font-medium">{formatSol(epoch.rewardsSol)}</span>
                          <span className="text-text-muted ml-1">SOL</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all',
                                  claimPercent >= 100 ? 'bg-accent-success' : 'bg-accent-primary'
                                )}
                                style={{ width: `${Math.min(claimPercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-caption text-text-muted w-12">
                              {claimPercent.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell text-text-secondary">
                          {formatNumber(epoch.numClaimants)}
                        </td>
                        <td className="hidden md:table-cell text-text-secondary text-caption">
                          {formatDate(epoch.publishedAt)}
                        </td>
                        <td>
                          <Link
                            href={`/epoch/${epoch.epochId}`}
                            className="link-muted p-1.5 inline-flex hover:text-text-primary"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.total > limit && (
              <div className="flex items-center justify-between p-4 border-t border-border-default">
                <div className="text-caption text-text-muted">
                  {page * limit + 1}–{Math.min((page + 1) * limit, data.total)} of {data.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data.hasMore}
                    className="btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
