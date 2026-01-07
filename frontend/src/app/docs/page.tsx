'use client';

import Link from 'next/link';
import { Book, Code, Shield, Zap, ArrowRight, ExternalLink } from 'lucide-react';

const docSections = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of Epoch Protocol and how to check your earnings.',
    links: [
      { label: 'What is Epoch?', href: '/docs/introduction' },
      { label: 'How Rewards Work', href: '/docs/rewards' },
      { label: 'Claiming SOL', href: '/docs/claiming' },
    ],
  },
  {
    icon: Shield,
    title: 'Verification',
    description: 'Understand how to verify your allocations and proofs.',
    links: [
      { label: 'Merkle Proofs Explained', href: '/docs/merkle-proofs' },
      { label: 'Verifying Your Allocation', href: '/docs/verification' },
      { label: 'Epoch Data Format', href: '/docs/data-format' },
    ],
  },
  {
    icon: Code,
    title: 'Developers',
    description: 'Integrate with Epoch Protocol programmatically.',
    links: [
      { label: 'SDK Reference', href: '/docs/sdk' },
      { label: 'API Documentation', href: '/docs/api' },
      { label: 'Smart Contract Reference', href: '/docs/contracts' },
    ],
  },
  {
    icon: Zap,
    title: 'Protocol',
    description: 'Deep dive into how the protocol works.',
    links: [
      { label: 'Architecture Overview', href: '/docs/architecture' },
      { label: 'Fee Distribution', href: '/docs/distribution' },
      { label: 'Keeper Bot', href: '/docs/keeper' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="page-fade min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-100 bg-bg-secondary/50">
        <div className="container-default py-8">
          <h1 className="text-h2 text-ink-900 mb-2">Documentation</h1>
          <p className="text-body text-ink-500 max-w-2xl">
            Everything you need to understand Epoch Protocol, verify your rewards, 
            and integrate with the system.
          </p>
        </div>
      </header>

      <main className="container-default py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <QuickLink
            href="/earnings"
            label="Check Earnings"
            description="View your wallet"
          />
          <QuickLink
            href="/epochs"
            label="View Epochs"
            description="Browse all epochs"
          />
          <QuickLink
            href="/security"
            label="Security"
            description="Verification & audits"
          />
          <QuickLink
            href="https://github.com/epoch-protocol"
            label="GitHub"
            description="Source code"
            external
          />
        </div>

        {/* Doc Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docSections.map((section) => (
            <div key={section.title} className="card">
              <div className="px-5 py-4 border-b border-surface-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-50 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-ink-500" />
                  </div>
                  <div>
                    <h2 className="text-title-sm text-ink-900">{section.title}</h2>
                    <p className="text-caption text-ink-500">{section.description}</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between py-2 px-3 -mx-3 rounded-md hover:bg-surface-50 transition-colors duration-180 group"
                      >
                        <span className="text-body-sm text-ink-700 group-hover:text-ink-900">
                          {link.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-accent transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 card-padded bg-bg-secondary/50 text-center">
          <h3 className="text-title-sm text-ink-900 mb-2">Need help?</h3>
          <p className="text-body-sm text-ink-500 mb-4">
            Join our Discord community or open an issue on GitHub.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://discord.gg/epoch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
            >
              Discord
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/epoch-protocol/epoch/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm"
            >
              GitHub Issues
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickLink({
  href,
  label,
  description,
  external = false,
}: {
  href: string;
  label: string;
  description: string;
  external?: boolean;
}) {
  const Component = external ? 'a' : Link;
  const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      href={href}
      className="card-padded card-interactive flex items-center justify-between"
      {...extraProps}
    >
      <div>
        <p className="text-body-sm font-medium text-ink-900">{label}</p>
        <p className="text-caption text-ink-500">{description}</p>
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 text-ink-300" />
      ) : (
        <ArrowRight className="w-4 h-4 text-ink-300" />
      )}
    </Component>
  );
}

