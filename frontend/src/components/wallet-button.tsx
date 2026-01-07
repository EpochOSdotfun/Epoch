'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { shortenAddress } from '@/lib/utils';

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (connected && publicKey) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="btn-secondary btn-sm"
        >
          <div className="w-2 h-2 rounded-full bg-positive" />
          <span className="font-mono text-mono">{shortenAddress(publicKey.toBase58())}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-surface-200 rounded-md shadow-elevated py-1 z-50">
            <button
              onClick={copyAddress}
              className="w-full px-4 py-2.5 text-body-sm text-ink-700 hover:bg-surface-50 flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-positive" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <div className="border-t border-surface-100 my-1" />
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2.5 text-body-sm text-negative hover:bg-surface-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={() => setVisible(true)} className="btn-primary btn-sm">
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
