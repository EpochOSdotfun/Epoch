'use client';

import Link from 'next/link';
import { CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { formatSol, formatDate, shortenAddress } from '@/lib/utils';

interface EpochItem {
  epochId: number;
  earnedSol: string;
  earnedToken: string;
  claimed: boolean;
  claimedSol: string;
  claimedToken: string;
  claimedAt: string | null;
  claimSig: string | null;
  publishedAt: string;
}

interface EpochBreakdownProps {
  epochs: EpochItem[];
}

export function EpochBreakdown({ epochs }: EpochBreakdownProps) {
  if (epochs.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No epochs found for this wallet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-text-muted text-sm border-b border-border-default">
            <th className="pb-3 font-medium">Epoch</th>
            <th className="pb-3 font-medium">Earned</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {epochs.map((epoch) => (
            <tr
              key={epoch.epochId}
              className="border-b border-border-default/50 hover:bg-bg-elevated/50 transition-colors"
            >
              <td className="py-4">
                <Link
                  href={`/epoch/${epoch.epochId}`}
                  className="text-accent-primary hover:underline font-mono"
                >
                  #{epoch.epochId}
                </Link>
              </td>
              <td className="py-4">
                <div className="font-semibold">{formatSol(epoch.earnedSol)} SOL</div>
                {epoch.earnedToken !== '0' && (
                  <div className="text-sm text-text-muted">
                    + {epoch.earnedToken} tokens
                  </div>
                )}
              </td>
              <td className="py-4">
                {epoch.claimed ? (
                  <div className="flex items-center gap-2 text-accent-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span>Claimed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-accent-warning">
                    <Clock className="w-4 h-4" />
                    <span>Unclaimed</span>
                  </div>
                )}
              </td>
              <td className="py-4 text-text-secondary text-sm">
                {epoch.claimed && epoch.claimedAt
                  ? formatDate(epoch.claimedAt)
                  : formatDate(epoch.publishedAt)}
              </td>
              <td className="py-4">
                {epoch.claimSig && (
                  <a
                    href={`https://solscan.io/tx/${epoch.claimSig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent-primary transition-colors"
                    title="View transaction"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

