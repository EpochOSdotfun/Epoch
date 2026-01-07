'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { shortenAddress } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-caption text-text-muted mono">
          {shortenAddress(publicKey.toBase58())}
        </span>
        <button
          onClick={() => disconnect()}
          className="btn-secondary btn-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="btn-primary btn-sm"
    >
      Connect Wallet
    </button>
  );
}
