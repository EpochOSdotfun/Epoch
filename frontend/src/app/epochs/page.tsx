'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { EpochTable } from '@/components/epoch-table';
import { EmptyState } from '@/components/empty-state';
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
  totalAllocations?: number;
  publishedAt: string;
  publishSig: string | null;
  merkleRoot?: string;
}

interface EpochsResponse {
  epochs: Epoch[];
  total: number;
  hasMore: boolean;
}

export default function EpochsPage() {
  const [page, setPage] = useState(0);
  const limit = 15;

  const { data, isLoading, error } = useQuery<EpochsResponse>({
    queryKey: ['epochs', page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs?limit=${limit}&offset=${page * limit}`
      );
      if (!res.ok) throw new Error('Failed to fetch epochs');
      return res.json();
    },
  });

  // Calculate summary stats
  const totalDistributed = data?.epochs.reduce(
    (sum, e) => sum + Number(e.rewardsSol), 0
  ) || 0;

  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-100 bg-bg-secondary/50">
        <div className="container-default py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-h2 text-ink-900">Epochs</h1>
              <p className="text-body text-ink-500 mt-1">
                All reward distribution epochs and their claim status
              </p>
            </div>
            {data && data.total > 0 && (
              <div className="flex items-center gap-6 text-body-sm">
                <div>
                  <span className="text-ink-500">Total Epochs:</span>{' '}
                  <span className="text-ink-900 font-medium">{data.total}</span>
                </div>
                <div>
                  <span className="text-ink-500">Distributed:</span>{' '}
                  <span className="text-ink-900 font-medium">{formatSol(totalDistributed.toString())} SOL</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container-default py-8">
        {error ? (
          <div className="card-padded text-center py-12">
            <p className="text-body-sm text-negative mb-2">Failed to load epochs</p>
            <p className="text-caption text-ink-500">{(error as Error).message}</p>
          </div>
        ) : !isLoading && (!data?.epochs || data.epochs.length === 0) ? (
          <EmptyState variant="no-epochs" />
        ) : (
          <div className="card overflow-hidden">
            <EpochTable 
              epochs={data?.epochs || []} 
              showExpand={true}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {data && data.total > limit && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-surface-100">
                <div className="text-caption text-ink-500">
                  Showing {page * limit + 1}–{Math.min((page + 1) * limit, data.total)} of {data.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.hasMore}
                    className="btn-ghost btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
