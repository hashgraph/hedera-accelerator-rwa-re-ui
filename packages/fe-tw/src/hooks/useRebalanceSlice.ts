"use client";

import { useQuery } from '@tanstack/react-query';

export function useRebalanceSlice(sliceName: string) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sliceData', sliceName],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      // mock to be replaced
      return { name: sliceName, allocation: { tokenA: '40%', tokenB: '60%' } };
    }
  });

  async function rebalance() {
    console.log(`Rebalance requested for slice: ${sliceName}`);
  }

  return { data, isLoading, isError, rebalance };
}
