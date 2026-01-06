'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Hash, Users, Coins, ExternalLink, Download, CheckCircle } from 'lucide-react';
import { useEpoch } from '@/hooks/useEpoch';
import { formatSol, formatNumber, formatDate } from '@/lib/utils';

export default function EpochPage() {
  const params = useParams();
  const epochId = params.id as string;
  const { data: epoch, isLoading, error } = useEpoch(parseInt(epochId));

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !epoch) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="card text-center py-12">
          <p className="text-accent-error mb-2">Epoch not found</p>
          <p className="text-text-secondary">Epoch #{epochId} does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 text-text-muted mb-2">
            <Calendar className="w-4 h-4" />
            <span>Epoch</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">
            Epoch <span className="text-gradient">#{epoch.epochId}</span>
          </h1>
          <p className="text-text-secondary">
            Published on {formatDate(epoch.publishedAt)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-accent-primary" />
              <span className="text-text-muted text-sm">Total Rewards</span>
            </div>
            <div className="text-2xl font-bold">{formatSol(epoch.rewardsSol)} SOL</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-accent-secondary" />
              <span className="text-text-muted text-sm">Claimed</span>
            </div>
            <div className="text-2xl font-bold">{epoch.claimProgress}%</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-accent-warning" />
              <span className="text-text-muted text-sm">Claimants</span>
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(epoch.numClaimants)} / {formatNumber(epoch.totalAllocations)}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-text-muted" />
              <span className="text-text-muted text-sm">Slot Range</span>
            </div>
            <div className="text-lg font-mono">
              {formatNumber(epoch.startSlot)} - {formatNumber(epoch.endSlot)}
            </div>
          </div>
        </motion.div>

        {/* Verification Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Verification</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-border-default">
              <span className="text-text-muted mb-1 md:mb-0">Merkle Root</span>
              <code className="text-sm bg-bg-tertiary px-3 py-1 rounded font-mono break-all">
                {epoch.merkleRoot}
              </code>
            </div>

            {epoch.csvHash && (
              <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-border-default">
                <span className="text-text-muted mb-1 md:mb-0">CSV Hash (SHA-256)</span>
                <code className="text-sm bg-bg-tertiary px-3 py-1 rounded font-mono break-all">
                  {epoch.csvHash}
                </code>
              </div>
            )}

            {epoch.publishSig && (
              <div className="flex flex-col md:flex-row md:items-center justify-between py-3">
                <span className="text-text-muted mb-1 md:mb-0">Publish Transaction</span>
                <a
                  href={`https://solscan.io/tx/${epoch.publishSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-primary hover:underline"
                >
                  <code className="text-sm">{epoch.publishSig.slice(0, 20)}...</code>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <a
            href={`/api/epochs/${epoch.epochId}/csv`}
            className="btn-secondary"
            download
          >
            <Download className="w-4 h-4" />
            Download Allocations CSV
          </a>
          <a
            href={`https://solscan.io/tx/${epoch.publishSig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            View on Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

