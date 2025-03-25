"use client";

import type { ExpenseRecord } from "@/consts/treasury";
import { addExpenseForBuilding, getExpensesForBuilding } from "@/services/treasuryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpensesData(buildingId: string) {
   const queryClient = useQueryClient();

   const {
      data: expenses,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["expenses", buildingId],
      queryFn: () => getExpensesForBuilding(buildingId),
   });

   const addExpenseMutation = useMutation({
      mutationFn: (args: Omit<ExpenseRecord, "id" | "buildingId" | "dateCreated">) => {
         return addExpenseForBuilding(buildingId, args);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["expenses", buildingId],
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
