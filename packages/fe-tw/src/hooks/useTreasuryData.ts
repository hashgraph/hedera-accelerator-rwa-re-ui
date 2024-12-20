"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  depositToTreasury,
  makeTreasuryPayment,
  setTreasuryReserveAmount,
  getTreasuryBalance,
  getTreasuryReserve,
  getBusinessBalance,
} from "@/services/treasuryService";

export function useTreasuryData() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["treasuryData"],
    queryFn: async () => ({
      balance: getTreasuryBalance(),
      reserve: getTreasuryReserve(),
      businessBalance: getBusinessBalance(),
    }),
  });

  const depositMutation = useMutation({
    mutationFn: (amount: number) => depositToTreasury(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
    },
    onError: (err: Error) => {
      console.error("Error:", err.message);
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (args: { to: string; amount: number }) =>
      makeTreasuryPayment(args.to, args.amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
    },
    onError: (err: Error) => {
      console.error("Error:", err.message);
    },
  });

  const reserveMutation = useMutation({
    mutationFn: (newReserve: number) => setTreasuryReserveAmount(newReserve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
    },
    onError: (err: Error) => {
      console.error("Error:", err.message);
    },
  });

  return {
    data,
    isLoading,
    isError,
    deposit: depositMutation.mutateAsync,
    makePayment: paymentMutation.mutateAsync,
    setReserve: reserveMutation.mutateAsync,
  };
}
