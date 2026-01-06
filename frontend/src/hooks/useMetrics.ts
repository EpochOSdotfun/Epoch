import { useQuery } from '@tanstack/react-query';

interface Metrics {
  price: string | null;
  liquidity: string;
  volume24h: string;
  totalDistributed: string;
  totalBurned: string;
  holderCount: number;
  currentEpoch: number;
  treasuryBalance: string;
  lastUpdated: string;
}

async function fetchMetrics(): Promise<Metrics> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

