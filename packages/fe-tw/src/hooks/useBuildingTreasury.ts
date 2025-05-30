"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { useWriteContract, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent"
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { ExpenseRecord } from "@/consts/treasury";
import { PaymentRequestPayload } from "@/types/erc3643/types";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ethers } from "ethers";
import { StorageKeys, storageService } from "@/services/storageService";

export function useBuildingTreasury(buildingAddress?: `0x${string}`) {
   const queryClient = useQueryClient();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const [treasuryAddress, setTreasuryAddress] = useState<`0x${string}`>();
   const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

   const { data: treasuryData, isLoading, isError } = useQuery({
      queryKey: ["treasuryData", treasuryAddress],
      queryFn: async () => {
         const treasuryUsdcAddress = await readContract({
            address: treasuryAddress!,
            abi: buildingTreasuryAbi,
            functionName: "usdc",
         });
   
         if (!treasuryUsdcAddress) return null;
   
         const [balance, decimals] = await Promise.all([
            readContract({
               address: treasuryUsdcAddress as `0x${string}`,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [treasuryAddress],
            }),
            readContract({
               address: treasuryUsdcAddress as `0x${string}`,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         return {
            balance: Number(ethers.formatUnits(balance as bigint, decimals as bigint)),
            usdcAddress: treasuryUsdcAddress,
            decimals,
         };
      },
      enabled: Boolean(treasuryAddress),
   });

   useEffect(() => {
      const unsubscribe = watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
         abi: buildingFactoryAbi,
         eventName: "NewBuilding",
         onLogs: (data) => {
            const treasuryLog = data.find(log => (log as unknown as { args: any[] }).args[0] === buildingAddress);

            if (treasuryLog) {
               setTreasuryAddress((treasuryLog as unknown as { args: any[] }).args[2]);
            }
         },
      });

      return () => unsubscribe();
   }, [buildingAddress]);

   useEffect(() => {
      if (treasuryAddress) {
         const unsubscribe = watchContractEvent({
            address: treasuryAddress!,
            abi: buildingTreasuryAbi,
            eventName: "Payment",
            onLogs: (data) => {
               storageService.restoreItem<ExpenseRecord[]>(StorageKeys.Expenses).then(storedExpensesData => {
                  if (storedExpensesData?.length) {
                     const expensePayments = storedExpensesData
                        .filter(expense =>
                           (data as unknown as { args: any[] }[]).find(
                              (payment) =>
                                 expense.receiver === payment.args[0] &&
                                 expense.amount === ethers.formatUnits(payment.args[1].toString(), 6)
                           )
                        );

                     if (expensePayments?.length) {
                        setExpenses(prev => [...prev, ...expensePayments]);
                     }
                  }
               });
            },
         });
         
         return () => unsubscribe();
      }
   }, [treasuryAddress]);

   const paymentMutation = useMutation({
      mutationFn: async (payload: PaymentRequestPayload) => {
         const txAmount = ethers.parseUnits(parseFloat(payload.amount).toString(), treasuryData?.decimals as string);

         if (!treasuryAddress) {
            throw new Error('No treasury address');
         }

         const tx = await executeTransaction(() => writeContract({
            functionName: 'makePayment',
            args: [payload.receiver, txAmount],
            abi: buildingTreasuryAbi,
            contractId: ContractId.fromEvmAddress(0, 0, treasuryAddress!),
         })) as { transaction_id: string };

         return tx;
      },
      onSuccess: (tx) => {
         toast.success(`Expense submitted successfully ${tx?.transaction_id}`);
         queryClient.invalidateQueries({ queryKey: ['treasuryData'] });
      },
      onError: (err: Error) => {
         toast.error(`Expense submitted error ${err.message}`);
      },
   });

   return {
      treasuryData,
      expenses,
      isLoading,
      isError,
      makePayment: paymentMutation.mutateAsync,
   };
}
