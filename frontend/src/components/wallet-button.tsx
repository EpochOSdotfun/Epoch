'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { shortenAddress } from '@/lib/utils';

interface WalletButtonProps {
  minimal?: boolean;
}

export function WalletButton({ minimal }: WalletButtonProps) {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        disabled={connecting}
        className={minimal ? 'btn-ghost' : 'btn-primary'}
      >
        {connecting ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {connecting ? 'Connecting...' : minimal ? 'Connect' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={minimal ? 'btn-ghost' : 'btn-secondary'}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        <span className="mono">{shortenAddress(publicKey!.toBase58())}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden z-50">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-elevated)] transition-colors text-left text-sm"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[var(--accent)]" />
            ) : (
              <Copy className="w-4 h-4 text-[var(--text-muted)]" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-elevated)] transition-colors text-left text-sm text-red-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}
