import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import {
   useEvmAddress,
   useReadContract,
   useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { readBuildingDetails } from "@/hooks/useBuildings";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { ContractId } from "@hashgraph/sdk";
import { TokenInfo, VaultInfo } from "@/components/Staking/types";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { useEffect } from "react";
import { ethers } from "ethers";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";

interface StakingHookReturnParams {
   loadingState: {
      isDepositing: boolean;
      isWithdrawing: boolean;
      isFetchingTokenInfo: boolean;
      isFetchingVaultInfo: boolean;
      isFetchingTreasuryAddress: boolean;
      isFetchingVaultAddress: boolean;
   };
   treasuryAddress: string | undefined;
   vaultAddress: string | undefined;
   tokenAddress: string | undefined;
   stakeTokens: (params: { amount: number }) => Promise<void>;
   unstakeTokens: (params: { amount: number }) => Promise<void>;
   userRewards?: number | undefined;
   tokenBalance: number | undefined;
   totalStakedTokens: number | undefined;
   userStakedTokens: number | undefined;
   rewardTokens: string[];
}

export const useStaking = ({
   buildingId,
}: {
   buildingId: `0x${string}`;
}): StakingHookReturnParams => {
   const { deployedBuildingTokens } = useBuildingDetails(buildingId);
   const { readContract } = useReadContract();
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();
   const { data: evmAddress } = useEvmAddress();
   const tokenAddress = deployedBuildingTokens[0]?.tokenAddress || "";

   const { data: treasuryAddress, isLoading: isFetchingTreasuryAddress } = useQuery({
      queryKey: ["BUILDING_DETAILS", buildingId],
      queryFn: () => readBuildingDetails(buildingId),
      select: (data) => data[0][5],
   });

   const { data: treasuryUsdcAddress, isLoading: isFetchingTreasuryAddress2 } = useQuery({
      queryKey: ["USDC", treasuryAddress],
      queryFn: () =>
         readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "usdc",
         }),
      enabled: Boolean(treasuryAddress),
   });

   const { data: vaultAddress, isLoading: isFetchingVaultAddress } = useQuery({
      queryKey: ["VAULT_ADDRESS", treasuryAddress],
      queryFn: () =>
         readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "vault",
         }),
      enabled: Boolean(treasuryAddress),
   });

   const { data: tokenInfo, isLoading: isFetchingTokenInfo } = useQuery({
      queryKey: ["TOKEN_INFO", tokenAddress],
      queryFn: async (): Promise<TokenInfo | null> => {
         const [balance, decimals] = await Promise.all([
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         const decimalValue = Number(decimals);
         return {
            tokenBalance: Number(balance) / 10 ** decimalValue,
            decimals: decimalValue,
         };
      },
      enabled: Boolean(tokenAddress) && Boolean(evmAddress),
   });

   const {
      data: vaultInfo,
      refetch: refetchVaultInfo,
      isLoading: isFetchingVaultInfo,
   } = useQuery({
      queryKey: ["VAULT_INFO", vaultAddress],
      queryFn: async (): Promise<VaultInfo | null> => {
         if (!vaultAddress || !evmAddress || !tokenInfo?.decimals) return null;

         const [totalAssets, myBalance, rewardTokens] = await Promise.all([
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "totalAssets",
            }),
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "getRewardTokens",
            }),
         ]);

         return {
            totalStakedTokens: Number(totalAssets) / 10 ** tokenInfo.decimals,
            userStakedTokens: Number(myBalance) / 10 ** tokenInfo.decimals,
            rewardTokens,
         };
      },
      enabled: Boolean(vaultAddress) && Boolean(tokenInfo) && Boolean(evmAddress),
   });

   const { data: userRewards } = useQuery({
      queryKey: ["USER_REWARDS", vaultInfo?.rewardTokens[0], evmAddress],
      queryFn: () =>
         readContract({
            address: vaultAddress,
            abi: basicVaultAbi,
            functionName: "getAllRewards",
            args: [evmAddress],
         }),
      enabled: Boolean(vaultInfo?.rewardTokens[0]) && Boolean(vaultAddress),
   });

   const { mutateAsync: stake, isPending: isDepositing } = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat(amount!) * 10 ** tokenInfo.decimals),
         );

         const approveTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, tokenAddress),
               abi: tokenAbi,
               functionName: "approve",
               args: [vaultAddress, bigIntAmount],
            }),
         );
         const depositTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, vaultAddress),
               abi: basicVaultAbi,
               functionName: "deposit",
               args: [bigIntAmount, evmAddress],
            }),
         );

         return { approveTx, depositTx };
      },
      onSuccess: refetchVaultInfo,
   });

   const { mutateAsync: unstake, isPending: isWithdrawing } = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat(amount!) * 10 ** tokenInfo.decimals),
         );

         const withdrawTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, vaultAddress),
               abi: basicVaultAbi,
               functionName: "withdraw",
               args: [bigIntAmount, evmAddress, evmAddress],
            }),
         );

         return withdrawTx;
      },
      onSuccess: refetchVaultInfo,
   });

   const { mutateAsync: addRewards } = useMutation({
      mutationFn: async () => {
         const rewardToken = await readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "usdc",
         });

         const decimals = await readContract({
            address: rewardToken,
            abi: tokenAbi,
            functionName: "decimals",
         });

         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat("1000000000") * 10 ** Number(decimals)),
         );

         const approveTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, rewardToken),
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

         console.log("rewardToken decimals :>> ", rewardToken, decimals, bigIntAmount);
      },
   });

   console.log("vaultInfo :>> ", vaultInfo);

   console.log("treasuryAddress :>> ", treasuryAddress);

   console.log("userRewards :>> ", userRewards);

   useEffect(() => {
      window.ethers = ethers;
      window.buildingTreasuryAbi = buildingTreasuryAbi;
      window.erc20Abi = tokenAbi;
      window.vaultAbi = basicVaultAbi;

      window.addRewards = addRewards;
   }, []);

   useEffect(() => {
      const unsub1 = watchContractEvent({
         address: treasuryAddress,
         abi: buildingTreasuryAbi,
         eventName: "Deposit",
         onLogs: (event) => {
            console.log("Deposit event :>> ", event);
         },
      });

      const unsub2 = watchContractEvent({
         address: treasuryAddress,
         abi: buildingTreasuryAbi,
         eventName: "Payment",
         onLogs: (event) => {
            console.log("Payment event :>> ", event);
         },
      });

      const unsub3 = watchContractEvent({
         address: treasuryAddress,
         abi: buildingTreasuryAbi,
         eventName: "FundsDistributed",
         onLogs: (event) => {
            console.log("FundsDistributed event :>> ", event);
         },
      });

      const unsub4 = watchContractEvent({
         address: treasuryAddress,
         abi: buildingTreasuryAbi,
         eventName: "ExcessFundsForwarded",
         onLogs: (event) => {
            console.log("ExcessFundsForwarded event :>> ", event);
         },
      });

      const unsub5 = watchContractEvent({
         address: vaultAddress,
         abi: basicVaultAbi,
         eventName: "RewardAdded",
         onLogs: (event) => {
            console.log("RewardAdded event :>> ", event);
         },
      });

      return () => {
         unsub1();
         unsub2();
         unsub3();
         unsub4();
         unsub5();
      };
   }, [treasuryAddress, vaultAddress]);

   return {
      loadingState: {
         isDepositing,
         isWithdrawing,
         isFetchingTokenInfo,
         isFetchingVaultInfo,
         isFetchingTreasuryAddress,
         isFetchingVaultAddress,
      },
      treasuryAddress,
      vaultAddress: vaultAddress as string,
      tokenAddress,
      stakeTokens: ({ amount }) => stake({ amount }),
      unstakeTokens: ({ amount }) => unstake({ amount }),
      userRewards: userRewards as number,
      ...vaultInfo,
      ...tokenInfo,
   };
};
