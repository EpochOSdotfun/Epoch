'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Filter, Download, Calendar, TrendingUp } from 'lucide-react';
import { useEpochs } from '@/hooks/useEpochs';
import { formatSol, formatNumber } from '@/lib/utils';

export default function EpochsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useEpochs(page);

  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-default h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ink-900 rounded flex items-center justify-center">
                <span className="text-white font-semibold text-sm">E</span>
              </div>
              <span className="font-semibold text-ink-900">Epoch</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/epochs" className="text-body-sm text-ink-900 font-medium">
                Epochs
              </Link>
              <Link href="/earnings" className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors">
                Earnings
              </Link>
            </nav>
          </div>
          <Link href="/earnings" className="btn-primary btn-sm">
            Check Earnings
          </Link>
        </div>
      </header>

      <main className="container-default py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-title-lg text-ink-900 mb-2">Epochs</h1>
            <p className="text-body text-ink-500">
              Complete history of distribution cycles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary btn-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="btn-secondary btn-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card">
            <p className="kpi-label">Total Epochs</p>
            <p className="kpi-value">{data?.totalCount || '—'}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Total Distributed</p>
            <p className="kpi-value">{data?.totalDistributed ? formatSol(data.totalDistributed) : '—'} SOL</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Avg per Epoch</p>
            <p className="kpi-value">{data?.avgPerEpoch ? formatSol(data.avgPerEpoch) : '—'} SOL</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Current Epoch</p>
            <p className="kpi-value flex items-center gap-2">
              #{data?.currentEpoch || '—'}
              <span className="badge-accent text-caption">Active</span>
            </p>
          </div>
        </div>

        {/* Epochs Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-body text-ink-500">Error loading epochs</p>
            </div>
          ) : data?.epochs && data.epochs.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Epoch</th>
                    <th>Date</th>
                    <th>Total Distributed</th>
                    <th>Holders</th>
                    <th>Avg Reward</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.epochs.map((epoch: any) => (
                    <tr key={epoch.id}>
                      <td>
                        <span className="font-medium text-ink-900">#{epoch.id}</span>
                      </td>
                      <td className="text-ink-500">
                        {new Date(epoch.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="mono-value font-medium">{formatSol(epoch.totalSol)} SOL</td>
                      <td className="mono-value">{formatNumber(epoch.holderCount)}</td>
                      <td className="mono-value text-ink-500">
                        {formatSol(String(Number(epoch.totalSol) / epoch.holderCount))} SOL
                      </td>
                      <td>
                        {epoch.status === 'ACTIVE' ? (
                          <span className="badge-accent">Active</span>
                        ) : epoch.status === 'COMPLETED' ? (
                          <span className="badge-positive">Completed</span>
                        ) : (
                          <span className="badge-neutral">{epoch.status}</span>
                        )}
                      </td>
                      <td className="text-right">
                        <Link href={`/epoch/${epoch.id}`} className="btn-ghost btn-sm">
                          View
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between">
                <p className="text-caption text-ink-500">
                  Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, data.totalCount)} of {data.totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary btn-sm disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * 20 >= data.totalCount}
                    className="btn-secondary btn-sm disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-ink-300 mx-auto mb-4" />
              <p className="text-body text-ink-700 mb-1">No epochs yet</p>
              <p className="text-body-sm text-ink-500">Epochs will appear here once distribution cycles begin</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
