import { useQuery, useMutation } from "@tanstack/react-query";
import { useReadContract, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ethers } from "ethers";
import { ContractId } from "@hashgraph/sdk";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";

export const useTreasuryData = (treasuryAddress: string | undefined) => {
   const { readContract } = useReadContract();
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();

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
      handleAddPayment,
      isSubmittingPayment: isPending,
   };
};
