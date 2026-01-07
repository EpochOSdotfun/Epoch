'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
import { Coins, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { formatSol } from '@/lib/utils';

interface ClaimButtonProps {
  wallet: string;
  unclaimedSol: string;
}

type ClaimState = 'idle' | 'loading' | 'success' | 'error';

export function ClaimButton({ wallet, unclaimedSol }: ClaimButtonProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [state, setState] = useState<ClaimState>('idle');
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setVisible(true);
      return;
    }

    // Verify wallet matches
    if (publicKey.toBase58() !== wallet) {
      setError('Connected wallet does not match the earnings wallet');
      setState('error');
      return;
    }

    setState('loading');
    setError(null);

    try {
      // Fetch unclaimed proofs
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proof/batch/${wallet}`
      );
      const data = await response.json();

      if (!data.proofs || data.proofs.length === 0) {
        setError('No unclaimed rewards found');
        setState('error');
        return;
      }

      // For simplicity, claim first unclaimed epoch
      const proof = data.proofs[0];

      // Build claim transaction
      const tx = new Transaction();
      // Add claim instruction (placeholder for actual implementation)

      // Sign and send
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, 'confirmed');

      setSignature(sig);
      setState('success');
    } catch (err: any) {
      console.error('Claim failed:', err);
      setError(err.message || 'Failed to claim rewards');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setSignature(null);
    setError(null);
  };

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Claimed!</span>
        </div>
        {signature && (
          <a
            href={`https://solscan.io/tx/${signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
          >
            View transaction <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button
          onClick={reset}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-red-400">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Failed</span>
        </div>
        <p className="text-sm text-[var(--text-muted)] text-center max-w-xs">{error}</p>
        <button onClick={reset} className="btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={state === 'loading'}
      className="btn-primary"
    >
      {state === 'loading' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          <Coins className="w-4 h-4" />
          Claim {formatSol(unclaimedSol)} SOL
        </>
      )}
    </button>
  );
}
