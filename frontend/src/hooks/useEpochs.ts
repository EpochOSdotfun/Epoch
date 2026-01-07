import { useQuery } from '@tanstack/react-query';

interface Epoch {
  id: number;
  publishedAt: string;
  totalSol: string;
  totalToken: string;
  holderCount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  merkleRoot: string;
}

interface EpochsResponse {
  epochs: Epoch[];
  totalCount: number;
  totalDistributed: string;
  avgPerEpoch: string;
  currentEpoch: number;
}

async function fetchEpochs(page: number): Promise<EpochsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs?page=${page}&limit=20`
  );
  if (!res.ok) throw new Error('Failed to fetch epochs');
  return res.json();
}

export function useEpochs(page: number = 1) {
  return useQuery({
    queryKey: ['epochs', page],
    queryFn: () => fetchEpochs(page),
    staleTime: 30 * 1000,
  });
}

