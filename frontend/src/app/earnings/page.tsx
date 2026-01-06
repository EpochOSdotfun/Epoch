'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, Wallet, ArrowRight, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useWalletEarnings } from '@/hooks/useWalletEarnings';
import { WalletButton } from '@/components/wallet-button';
import { ClaimButton } from '@/components/claim-button';
import { EpochBreakdown } from '@/components/epoch-breakdown';
import { formatSol, formatNumber, shortenAddress } from '@/lib/utils';

export default function EarningsPage() {
  const { publicKey, connected } = useWallet();
  const [inputAddress, setInputAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const walletAddress = connected ? publicKey?.toBase58() : searchAddress;
  const { data: earnings, isLoading, error } = useWalletEarnings(walletAddress || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAddress(inputAddress);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-4">
            Your <span className="text-gradient">Earnings</span> Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Track your rewards, view epoch breakdowns, and claim your SOL
          </p>
        </motion.div>

        {/* Wallet Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Enter wallet address..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="input pl-12"
                    disabled={connected}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={connected || !inputAddress}
                >
                  Search
                </button>
              </form>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-muted">or</span>
              <WalletButton />
            </div>
          </div>

          {connected && publicKey && (
            <div className="mt-4 flex items-center gap-2 text-text-secondary">
              <Wallet className="w-4 h-4" />
              <span>Connected: </span>
              <code className="text-accent-primary">{shortenAddress(publicKey.toBase58())}</code>
            </div>
          )}
        </motion.div>

        {/* Earnings Summary */}
        {walletAddress && (
          <>
            {isLoading ? (
              <div className="card text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-text-secondary">Loading earnings data...</p>
              </div>
            ) : error ? (
              <div className="card text-center py-12">
                <p className="text-accent-error mb-2">Error loading earnings</p>
                <p className="text-text-secondary text-sm">{(error as Error).message}</p>
              </div>
            ) : earnings ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent-primary/10">
                        <Wallet className="w-5 h-5 text-accent-primary" />
                      </div>
                      <span className="text-text-muted">Total Earned</span>
                    </div>
                    <div className="stat-value">{formatSol(earnings.totalEarnedSol)} SOL</div>
                    {earnings.totalEarnedToken !== '0' && (
                      <div className="text-text-secondary mt-1">
                        + {formatNumber(earnings.totalEarnedToken)} tokens
                      </div>
                    )}
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent-secondary/10">
                        <CheckCircle className="w-5 h-5 text-accent-secondary" />
                      </div>
                      <span className="text-text-muted">Claimed</span>
                    </div>
                    <div className="stat-value">{formatSol(earnings.totalClaimedSol)} SOL</div>
                    <div className="text-text-secondary mt-1">
                      {earnings.claimedEpochs} / {earnings.eligibleEpochs} epochs
                    </div>
                  </div>

                  <div className="card gradient-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent-warning/10">
                        <Clock className="w-5 h-5 text-accent-warning" />
                      </div>
                      <span className="text-text-muted">Unclaimed</span>
                    </div>
                    <div className="stat-value glow-text">{formatSol(earnings.unclaimedSol)} SOL</div>
                    <div className="text-text-secondary mt-1">
                      {earnings.eligibleEpochs - earnings.claimedEpochs} epochs pending
                    </div>
                  </div>
                </div>

                {/* Claim Section */}
                {BigInt(earnings.unclaimedSol) > 0n && (
                  <div className="card mb-8 bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          You have unclaimed rewards!
                        </h3>
                        <p className="text-text-secondary">
                          {formatSol(earnings.unclaimedSol)} SOL available from{' '}
                          {earnings.eligibleEpochs - earnings.claimedEpochs} epochs
                        </p>
                      </div>
                      <ClaimButton
                        wallet={walletAddress}
                        unclaimedSol={earnings.unclaimedSol}
                      />
                    </div>
                  </div>
                )}

                {/* Epoch Breakdown */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-6">Epoch Breakdown</h3>
                  <EpochBreakdown epochs={earnings.epochBreakdown} />
                </div>
              </motion.div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-text-secondary">No earnings found for this wallet</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!walletAddress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bg-tertiary flex items-center justify-center">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter a Wallet Address</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Connect your wallet or enter any Solana address to view earnings and claim history.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

