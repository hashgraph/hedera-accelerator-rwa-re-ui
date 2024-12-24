"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpensesForBuilding, addExpenseForBuilding } from "@/services/treasuryService";
import { ExpenseRecord } from "@/consts/treasury";

export function useExpensesData(buildingId: string) {
  const queryClient = useQueryClient();

  const { data: expenses, isLoading, isError } = useQuery({
    queryKey: ["expenses", buildingId],
    queryFn: () => getExpensesForBuilding(buildingId),
  });

  const addExpenseMutation = useMutation({
    mutationFn: (args: Omit<ExpenseRecord, "id" | "buildingId" | "dateCreated">) => {
      return addExpenseForBuilding(buildingId, args);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['expenses', buildingId], 
          });
    },
  });

  return {
    expenses,
    isLoading,
    isError,
    addExpense: addExpenseMutation.mutateAsync,
  };
}
