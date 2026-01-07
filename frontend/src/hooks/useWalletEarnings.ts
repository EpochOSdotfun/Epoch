import { useQuery } from '@tanstack/react-query';

interface EpochBreakdown {
  epochId: number;
  earnedSol: string;
  earnedToken: string;
  claimed: boolean;
  claimedSol: string;
  claimedToken: string;
  claimedAt: string | null;
  claimSig: string | null;
  publishedAt: string;
}

interface WalletEarnings {
  wallet: string;
  totalEarnedSol: string;
  totalEarnedToken: string;
  totalClaimedSol: string;
  totalClaimedToken: string;
  unclaimedSol: string;
  unclaimedToken: string;
  eligibleEpochs: number;
  claimedEpochs: number;
  epochBreakdown: EpochBreakdown[];
}

async function fetchWalletEarnings(wallet: string): Promise<WalletEarnings> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wallet/${wallet}/earnings`
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('No earnings found for this wallet');
    }
    throw new Error('Failed to fetch earnings');
  }
  return res.json();
}

export function useWalletEarnings(wallet: string) {
  return useQuery({
    queryKey: ['wallet-earnings', wallet],
    queryFn: () => fetchWalletEarnings(wallet),
    enabled: !!wallet && wallet.length >= 32,
    retry: false,
    staleTime: 60000, // 1 minute
  });
}


