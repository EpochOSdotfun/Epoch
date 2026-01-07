'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const mockEpochs = [
  {
    id: 127,
    amount: '12.45',
    merkleRoot: '5nYp...8mKq',
    publishedAt: '2024-01-07 14:32 UTC',
    txHash: 'abc123',
  },
  {
    id: 126,
    amount: '11.89',
    merkleRoot: '3bMz...9wPx',
    publishedAt: '2024-01-06 14:28 UTC',
    txHash: 'def456',
  },
  {
    id: 125,
    amount: '14.22',
    merkleRoot: '8xKp...2nVq',
    publishedAt: '2024-01-05 14:31 UTC',
    txHash: 'ghi789',
  },
  {
    id: 124,
    amount: '10.67',
    merkleRoot: '1cRt...7jHw',
    publishedAt: '2024-01-04 14:29 UTC',
    txHash: 'jkl012',
  },
  {
    id: 123,
    amount: '13.54',
    merkleRoot: '9pLm...4kNs',
    publishedAt: '2024-01-03 14:30 UTC',
    txHash: 'mno345',
  },
];

export function TransparencyTable() {
  return (
    <div className="card-transparent overflow-hidden">
      <table className="editorial-table">
        <thead>
          <tr>
            <th className="w-20">Epoch</th>
            <th className="w-28">Amount</th>
            <th>Merkle Root</th>
            <th className="hidden md:table-cell">Published</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {mockEpochs.map((epoch) => (
            <tr key={epoch.id}>
              <td>
                <Link
                  href={`/epoch/${epoch.id}`}
                  className="text-[var(--text-primary)] hover:text-accent transition-colors"
                >
                  #{epoch.id}
                </Link>
              </td>
              <td>
                <span className="text-[var(--text-primary)]">{epoch.amount}</span>
                <span className="text-[var(--text-muted)] ml-1">SOL</span>
              </td>
              <td className="mono-cell">{epoch.merkleRoot}</td>
              <td className="hidden md:table-cell text-[var(--text-muted)]">
                {epoch.publishedAt}
              </td>
              <td>
                <a
                  href={`https://solscan.io/tx/${epoch.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-accent transition-colors"
                  aria-label="View on Solscan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

