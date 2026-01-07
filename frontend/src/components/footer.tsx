'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const DISTRIBUTOR_PROGRAM = 'DistrXXX...abc';
const CONTROLLER_PROGRAM = 'CtrlXXX...def';

const footerLinks = {
  product: [
    { label: 'Earnings', href: '/earnings' },
    { label: 'Epochs', href: '/epochs' },
    { label: 'Docs', href: '/docs' },
    { label: 'FAQ', href: '/faq' },
  ],
  developers: [
    { label: 'GitHub', href: 'https://github.com/epoch-protocol', external: true },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'SDK', href: '/docs/sdk' },
  ],
  legal: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Security', href: '/security' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-surface-100 bg-bg-secondary">
      {/* Main Footer */}
      <div className="container-default py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-ink-900 rounded flex items-center justify-center">
                <span className="text-bg-primary font-semibold text-body-sm">E</span>
              </div>
              <span className="font-semibold text-body text-ink-900">Epoch</span>
            </Link>
            <p className="text-caption text-ink-500 max-w-xs">
              Automated SOL rewards from LP fees. Transparent. Verifiable. Claimable.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-caption text-ink-500 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors duration-180"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h4 className="text-caption text-ink-500 uppercase tracking-wider mb-4">Developers</h4>
            <ul className="space-y-2">
              {footerLinks.developers.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-body-sm text-ink-500 hover:text-ink-900 transition-colors duration-180"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors duration-180"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-caption text-ink-500 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors duration-180"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Dense & Technical */}
      <div className="border-t border-surface-100">
        <div className="container-default py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-caption text-ink-300">
            {/* Program IDs */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <span className="status-dot-live" />
                <span className="text-ink-500">Mainnet</span>
              </span>
              <span>
                Distributor:{' '}
                <a
                  href={`https://solscan.io/account/${DISTRIBUTOR_PROGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-ink-500 hover:text-accent transition-colors"
                >
                  {DISTRIBUTOR_PROGRAM}
                </a>
              </span>
              <span>
                Controller:{' '}
                <a
                  href={`https://solscan.io/account/${CONTROLLER_PROGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-ink-500 hover:text-accent transition-colors"
                >
                  {CONTROLLER_PROGRAM}
                </a>
              </span>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-4">
              <a
                href="https://status.epoch.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-500 transition-colors"
              >
                Status
              </a>
              <span className="text-surface-200">·</span>
              <span>© {new Date().getFullYear()} Epoch Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

