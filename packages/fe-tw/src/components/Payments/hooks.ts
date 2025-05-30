import { useQuery, useMutation } from "@tanstack/react-query";
import { useReadContract, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ethers } from "ethers";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { watchContractEvent } from "@/services/contracts/watchContractEvent"
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { StorageKeys, storageService } from "@/services/storageService";

export const useTreasuryData = (treasuryAddress: string | undefined) => {
   const { readContract } = useReadContract();
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();
   const [payments, setPayments] = useState<any[]>([]);
   
     useEffect(() => {
         if (treasuryAddress) {
            const unsubscribe = watchContractEvent({
               address: treasuryAddress!,
               abi: buildingTreasuryAbi,
               eventName: "Deposit",
               onLogs: (data) => {
                  storageService.restoreItem<any[]>(StorageKeys.Payments).then(storedPaymentsData => {
                     if (storedPaymentsData?.length) {
                        const expensePayments = storedPaymentsData
                           .filter(storedPayment =>
                              (data as unknown as { args: any[] }[]).find(
                                 (payment) =>
                                    storedPayment.sender === payment.args[0] &&
                                    storedPayment.amount === parseFloat(ethers.formatUnits(payment.args[1].toString(), 6)).toString()
                              )
                           );
   
                        if (expensePayments?.length) {
                           setPayments(prev => [...prev, ...expensePayments]);
                        }
                     }
                  });
               },
            });
            
            return () => unsubscribe();
         }
   }, [treasuryAddress]);

   const { data } = useQuery({
      queryKey: ["treasuryData", treasuryAddress],
      queryFn: async () => {
         if (!treasuryAddress) return null;
         const treasuryUsdcAddress = await readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "usdc",
         });

         if (!treasuryUsdcAddress) return null;

         const [balance, decimals] = await Promise.all([
            readContract({
               address: treasuryUsdcAddress,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [treasuryAddress],
            }),
            readContract({
               address: treasuryUsdcAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         const formatted = Number(ethers.formatUnits(balance, decimals));

         return { balance: formatted, usdcAddress: treasuryUsdcAddress, decimals };
      },
      enabled: Boolean(treasuryAddress),
   });

   const { mutateAsync: handleAddPayment, isPending } = useMutation({
      mutationFn: async (amount: number) => {
         if (!treasuryAddress) {
            throw new Error("Treasury address not found");
         }
         if (!data?.decimals || !data?.usdcAddress) {
            throw new Error("Treasury data (decimals or USDC address) not loaded yet.");
         }

         const bigIntAmount = ethers.parseUnits(amount.toString(), data.decimals);

         const approveTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, data.usdcAddress as string),
               abi: tokenAbi,
               functionName: "approve",
               args: [treasuryAddress, bigIntAmount],
            }),
         );

         const depositTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, treasuryAddress),
               abi: buildingTreasuryAbi,
               functionName: "deposit",
               args: [bigIntAmount],
            }),
         );
         return { approveTx, depositTx };
      },
   });

   return {
      data: data?.balance,
      usdcAddress: data?.usdcAddress,
      decimals: data?.decimals,
      payments,
      isSubmittingPayment: isPending,
      handleAddPayment,
   };
};
