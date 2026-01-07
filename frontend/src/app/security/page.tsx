'use client';

import { Shield, FileCheck, Lock, Eye, ExternalLink, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const securityItems = [
  {
    icon: Shield,
    title: 'Merkle Proof Verification',
    description: 'Every allocation is cryptographically provable using Merkle trees. You can independently verify your rewards without trusting any centralized party.',
    status: 'verified' as const,
    details: [
      'Each epoch publishes a Merkle root on-chain',
      'Individual proofs can be generated and verified client-side',
      'SDK available for programmatic verification',
    ],
  },
  {
    icon: FileCheck,
    title: 'Public Epoch Data',
    description: 'All epoch snapshots, allocations, and Merkle roots are published publicly and downloadable as CSV files.',
    status: 'verified' as const,
    details: [
      'Full allocation CSVs available for every epoch',
      'SHA-256 hash of each CSV published on-chain',
      'Historical data preserved indefinitely',
    ],
  },
  {
    icon: Lock,
    title: 'Non-Custodial Claims',
    description: 'Rewards go directly from the program to your wallet. No intermediary ever holds your funds.',
    status: 'verified' as const,
    details: [
      'Smart contract enforces direct wallet transfers',
      'No admin keys can redirect funds',
      'Claim transactions are atomic and verifiable',
    ],
  },
  {
    icon: Eye,
    title: 'Open Source Contracts',
    description: 'Both Distributor and Controller programs are fully open source and auditable on GitHub.',
    status: 'verified' as const,
    details: [
      'Complete Anchor/Rust source code available',
      'Verified program deployments on Solana',
      'Community contributions welcome',
    ],
  },
];

type AuditStatus = 'verified' | 'pending';

const auditItems: Array<{
  title: string;
  auditor: string;
  date: string;
  status: AuditStatus;
}> = [
  {
    title: 'Smart Contract Audit',
    auditor: 'Pending',
    date: 'Q1 2024',
    status: 'pending',
  },
  {
    title: 'Economic Audit',
    auditor: 'Pending',
    date: 'Q1 2024',
    status: 'pending',
  },
];

export default function SecurityPage() {
  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-100 bg-bg-secondary/50">
        <div className="container-default py-8">
          <h1 className="text-h2 text-ink-900 mb-2">Security & Transparency</h1>
          <p className="text-body text-ink-500 max-w-2xl">
            Every aspect of the Epoch Protocol is designed to be verifiable and trustless. 
            No trust in us required—verify everything yourself.
          </p>
        </div>
      </header>

      <main className="container-default py-8 space-y-12">
        {/* Security Features */}
        <section>
          <h2 className="text-title text-ink-900 mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityItems.map((item) => (
              <div key={item.title} className="card">
                <div className="px-5 py-4 border-b border-surface-100">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'checklist-icon mt-0.5',
                      item.status === 'verified' ? 'checklist-icon-done' : 'checklist-icon-pending'
                    )}>
                      {item.status === 'verified' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-body-sm font-medium text-ink-900">{item.title}</h3>
                        {item.status === 'verified' && (
                          <span className="badge-positive">Verified</span>
                        )}
                      </div>
                      <p className="text-caption text-ink-500">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <ul className="space-y-2">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-caption text-ink-500">
                        <span className="text-accent mt-0.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audits */}
        <section>
          <h2 className="text-title text-ink-900 mb-6">Audits</h2>
          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Audit Type</th>
                  <th>Auditor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditItems.map((audit) => (
                  <tr key={audit.title}>
                    <td className="font-medium text-ink-900">{audit.title}</td>
                    <td className="text-ink-500">{audit.auditor}</td>
                    <td className="text-ink-500">{audit.date}</td>
                    <td>
                      <span className={cn(
                        'badge',
                        audit.status === 'verified' ? 'badge-positive' : 'badge-warning'
                      )}>
                        {audit.status === 'verified' ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Program IDs */}
        <section>
          <h2 className="text-title text-ink-900 mb-6">Verified Programs</h2>
          <div className="card-padded space-y-4">
            <ProgramRow
              name="Distributor Program"
              address="DistrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
            <ProgramRow
              name="Controller Program"
              address="CtrlXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-title text-ink-900 mb-6">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://github.com/epoch-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="card-padded card-interactive flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-ink-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <p className="text-body-sm font-medium text-ink-900">GitHub</p>
                <p className="text-caption text-ink-500">View source code</p>
              </div>
              <ExternalLink className="w-4 h-4 text-ink-300 ml-auto" />
            </a>

            <a
              href="/docs/verification"
              className="card-padded card-interactive flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-ink-500" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-ink-900">Verification Guide</p>
                <p className="text-caption text-ink-500">How to verify proofs</p>
              </div>
            </a>

            <a
              href="/docs/sdk"
              className="card-padded card-interactive flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-ink-500" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-ink-900">SDK</p>
                <p className="text-caption text-ink-500">Integrate with Epoch</p>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgramRow({ name, address }: { name: string; address: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
      <span className="text-body-sm text-ink-700">{name}</span>
      <a
        href={`https://solscan.io/account/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-mono text-mono text-accent hover:underline"
      >
        {address.slice(0, 8)}...{address.slice(-8)}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

