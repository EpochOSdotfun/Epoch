'use client';

import Link from 'next/link';
import { Check, Clock, ExternalLink, HelpCircle } from 'lucide-react';
import { formatSol, formatDate, shortenAddress } from '@/lib/utils';
import { Tooltip, tooltipContent } from './tooltip';
import { cn } from '@/lib/utils';

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
      <div className="text-center py-12 text-text-muted text-body">
        No epoch data available for this wallet.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Epoch</th>
            <th>Earned</th>
            <th>Status</th>
            <th className="hidden md:table-cell">Date</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {epochs.map((epoch) => (
            <tr key={epoch.epochId}>
              <td>
                <Link
                  href={`/epoch/${epoch.epochId}`}
                  className="mono link"
                >
                  #{epoch.epochId}
                </Link>
              </td>
              <td>
                <span className="font-medium">{formatSol(epoch.earnedSol)}</span>
                <span className="text-text-muted ml-1">SOL</span>
                {epoch.earnedToken !== '0' && (
                  <span className="text-caption text-text-muted block">
                    + {epoch.earnedToken} tokens
                  </span>
                )}
              </td>
              <td>
                {epoch.claimed ? (
                  <span className="badge badge-success">
                    <Check className="w-3 h-3" />
                    Claimed
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </td>
              <td className="hidden md:table-cell text-text-secondary text-caption">
                {epoch.claimed && epoch.claimedAt
                  ? formatDate(epoch.claimedAt)
                  : formatDate(epoch.publishedAt)}
              </td>
              <td>
                {epoch.claimSig && (
                  <a
                    href={`https://solscan.io/tx/${epoch.claimSig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-muted p-1.5 inline-flex hover:text-text-primary"
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

// Activity log component for claims tab
interface ClaimActivity {
  epochId: number;
  amount: string;
  signature: string;
  timestamp: string;
}

export function ClaimHistory({ claims }: { claims: ClaimActivity[] }) {
  if (claims.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-body">
        No claim history yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {claims.map((claim) => (
        <div 
          key={claim.signature}
          className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg"
        >
          <div>
            <div className="text-body font-medium">
              {formatSol(claim.amount)} SOL
            </div>
            <div className="text-caption text-text-muted">
              Epoch #{claim.epochId} • {formatDate(claim.timestamp)}
            </div>
          </div>
          <a
            href={`https://solscan.io/tx/${claim.signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
        </div>
      ))}
    </div>
  );
}
