'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, Coins, Users, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { formatSol, formatNumber } from '@/lib/utils';

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
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const { data, isLoading } = useQuery<EpochsResponse>({
    queryKey: ['epochs', page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs?limit=${limit}&offset=${page * limit}`
      );
      return res.json();
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]);

  const addRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container-editorial section-gap pb-16">
        <div
          ref={addRevealRef(0)}
          className="reveal max-w-2xl"
          style={{ animationDelay: '0ms' }}
        >
          <p className="label mb-4">Distribution History</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Reward epochs
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Each epoch represents a 24-hour distribution cycle. View rewards, claim progress,
            and on-chain verification for all published epochs.
          </p>
        </div>
      </section>

      <div className="divider container-editorial" />

      {/* Epochs Table */}
      <section className="container-editorial section-gap">
        <div
          ref={addRevealRef(1)}
          className="reveal"
          style={{ animationDelay: '40ms' }}
        >
          {isLoading ? (
            <div className="text-center py-24">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">Loading epochs...</p>
            </div>
          ) : data?.epochs.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 border border-[var(--border-dim)] flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-6 h-6 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-light mb-2">No epochs published</h3>
              <p className="text-[var(--text-muted)] text-sm">
                The first distribution epoch hasn't been published yet.
              </p>
            </div>
          ) : (
            <>
              <div className="card-transparent overflow-hidden">
                <table className="editorial-table">
                  <thead>
                    <tr>
                      <th className="w-24">Epoch</th>
                      <th>Rewards</th>
                      <th>Claim Progress</th>
                      <th className="hidden md:table-cell">Claimants</th>
                      <th className="hidden lg:table-cell">Published</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.epochs.map((epoch, index) => {
                      const claimPercent =
                        Number(epoch.rewardsSol) > 0
                          ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol)) * 100
                          : 0;

                      return (
                        <tr
                          key={epoch.epochId}
                          ref={addRevealRef(index + 2)}
                          className="reveal"
                          style={{ animationDelay: `${(index + 2) * 40}ms` }}
                        >
                          <td>
                            <Link
                              href={`/epoch/${epoch.epochId}`}
                              className="mono text-[var(--accent)] hover:underline underline-offset-4"
                            >
                              #{epoch.epochId}
                            </Link>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Coins className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              <span className="text-[var(--text-primary)]">
                                {formatSol(epoch.rewardsSol)}
                              </span>
                              <span className="text-[var(--text-muted)]">SOL</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-1 bg-[var(--bg-primary)] overflow-hidden">
                                <div
                                  className="h-full bg-[var(--accent)] transition-all"
                                  style={{ width: `${Math.min(claimPercent, 100)}%` }}
                                />
                              </div>
                              <span className="mono text-xs text-[var(--text-muted)]">
                                {claimPercent.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell">
                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                              <Users className="w-3.5 h-3.5" />
                              <span>{formatNumber(epoch.numClaimants)}</span>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell text-[var(--text-muted)] text-xs">
                            {new Date(epoch.publishedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td>
                            {epoch.publishSig && (
                              <a
                                href={`https://solscan.io/tx/${epoch.publishSig}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                                aria-label="View on Solscan"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.total > limit && (
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-[var(--border-dim)]">
                  <div className="text-[var(--text-muted)] text-sm">
                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, data.total)} of {data.total}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!data.hasMore}
                      className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
