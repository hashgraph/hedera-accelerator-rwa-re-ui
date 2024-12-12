"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSliceTokensData, performRebalance } from '@/services/sliceService';

export function useRebalanceSlice(sliceName: string) {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sliceData', sliceName],
    queryFn: () => getSliceTokensData(sliceName),
  });

  const mutation = useMutation({
    mutationFn: () => performRebalance(sliceName),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliceData', sliceName]);
    }
  });

  async function rebalance() {
    await mutation.mutateAsync();
  }

  return { data, isLoading, isError, rebalance };
}
