"use client";

import { getSliceTokensData, performRebalance } from "@/services/sliceService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRebalanceSlice(sliceName: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sliceData", sliceName],
    queryFn: () => getSliceTokensData(sliceName),
  });

  const mutation = useMutation({
    mutationFn: () => performRebalance(sliceName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sliceData", sliceName],
      });
    },
  });

  async function rebalance() {
    await mutation.mutateAsync();
  }

  return { data, isLoading, isError, rebalance };
}
