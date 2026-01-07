'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Coins, Users, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatSol, formatNumber, formatDate } from '@/lib/utils';

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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-4">
            Reward <span className="text-gradient">Epochs</span>
          </h1>
          <p className="text-text-secondary text-lg">
            View all reward distribution epochs and their claim status
          </p>
        </motion.div>

        {/* Epochs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-text-secondary">Loading epochs...</p>
            </div>
          ) : data?.epochs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary">No epochs published yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-text-muted text-sm border-b border-border-default">
                      <th className="pb-3 font-medium">Epoch</th>
                      <th className="pb-3 font-medium">Rewards</th>
                      <th className="pb-3 font-medium">Claimed</th>
                      <th className="pb-3 font-medium">Claimants</th>
                      <th className="pb-3 font-medium">Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.epochs.map((epoch, index) => {
                      const claimPercent =
                        BigInt(epoch.rewardsSol) > 0n
                          ? (Number(epoch.claimedSol) / Number(epoch.rewardsSol)) * 100
                          : 0;

                      return (
                        <motion.tr
                          key={epoch.epochId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border-default/50 hover:bg-bg-elevated/50 transition-colors"
                        >
                          <td className="py-4">
                            <Link
                              href={`/epoch/${epoch.epochId}`}
                              className="flex items-center gap-2 text-accent-primary hover:underline"
                            >
                              <span className="font-mono font-semibold">#{epoch.epochId}</span>
                            </Link>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-accent-primary" />
                              <span className="font-semibold">{formatSol(epoch.rewardsSol)} SOL</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent-primary rounded-full transition-all"
                                  style={{ width: `${Math.min(claimPercent, 100)}%` }}
                                />
                              </div>
                              <span className="text-text-secondary text-sm">
                                {claimPercent.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2 text-text-secondary">
                              <Users className="w-4 h-4" />
                              {formatNumber(epoch.numClaimants)}
                            </div>
                          </td>
                          <td className="py-4 text-text-secondary text-sm">
                            {formatDate(epoch.publishedAt)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.total > limit && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-default">
                  <div className="text-text-secondary text-sm">
                    Showing {page * limit + 1}-{Math.min((page + 1) * limit, data.total)} of {data.total}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!data.hasMore}
                      className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}


