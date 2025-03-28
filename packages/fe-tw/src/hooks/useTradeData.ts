"use client";

import {
   buyBuildingTokenWithUSDC,
   getUserTradeData,
   sellBuildingTokenForUSDC,
} from "@/services/tradeService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTradeData() {
   const queryClient = useQueryClient();

   const { data, isLoading, isError } = useQuery({
      queryKey: ["tradeData"],
      queryFn: getUserTradeData,
   });

   const sellMutation = useMutation({
      mutationFn: (args: { buildingId: `0x${string}`; amount: number }) =>
         sellBuildingTokenForUSDC(args.buildingId, args.amount),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tradeData"] }),
   });

   const buyMutation = useMutation({
      mutationFn: (args: { buildingId: `0x${string}`; usdcAmount: number }) =>
         buyBuildingTokenWithUSDC(args.buildingId, args.usdcAmount),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tradeData"] }),
   });

   return {
      data,
      isLoading,
      isError,
      sellTokens: sellMutation.mutateAsync,
      buyTokens: buyMutation.mutateAsync,
   };
}
