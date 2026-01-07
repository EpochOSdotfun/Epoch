'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Transaction, PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
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
      // In production, you might batch claims or let user choose
      const proof = data.proofs[0];

      // Build claim transaction
      // This would use the Anchor SDK in production
      const tx = new Transaction();
      // Add claim instruction...
      // tx.add(claimInstruction);

      // Placeholder: In production, build actual claim instruction
      // using the distributor program IDL

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

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClaim}
            className="btn-primary text-lg"
          >
            <Coins className="w-5 h-5" />
            Claim {formatSol(unclaimedSol)} SOL
          </motion.button>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="btn-primary text-lg pointer-events-none"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Claiming...
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-accent-primary">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Claimed Successfully!</span>
            </div>
            {signature && (
              <a
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-accent-primary flex items-center gap-1"
              >
                View transaction <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button onClick={reset} className="text-sm text-text-muted hover:text-text-primary">
              Done
            </button>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-accent-error">
              <XCircle className="w-6 h-6" />
              <span className="font-semibold">Claim Failed</span>
            </div>
            <p className="text-sm text-text-secondary text-center max-w-xs">{error}</p>
            <button onClick={reset} className="btn-secondary">
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


