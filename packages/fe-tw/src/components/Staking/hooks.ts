import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { ContractId } from "@hashgraph/sdk";
import { VaultInfo } from "@/components/Staking/types";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import useWriteContract from "@/hooks/useWriteContract";
import { ethers } from "ethers";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";

interface StakingLoadingState {
   isDepositing: boolean;
   isWithdrawing: boolean;
   isFetchingTokenInfo: boolean;
   isFetchingVaultInfo: boolean;
   isFetchingTreasuryAddress: boolean;
   isFetchingVaultAddress: boolean;
   isFetchingTokenPrice: boolean;
}

interface StakingData {
   treasuryAddress: string | undefined;
   vaultAddress: string | undefined;
   tokenAddress: string | undefined;
   tokenBalance: number | undefined;
   totalStakedTokens: number | undefined;
   userStakedTokens: number | undefined;
   rewardTokens: string[];
   userRewards: string | undefined;
   tokenPriceInUSDC: number | undefined;
   tvl: number | undefined;
}

interface StakingActions {
   stakeTokens: (params: { amount: number }) => Promise<void>;
   unstakeTokens: (params: { amount: number }) => Promise<void>;
}

interface StakingHookReturnParams extends StakingData, StakingActions {
   loadingState: StakingLoadingState;
}

export const useStaking = ({
   buildingId,
}: {
   buildingId: `0x${string}`;
}): StakingHookReturnParams => {
   const {
      tokenAddress,
      vaultAddress,
      treasuryAddress,
      isLoading: isFetchingAddresses,
   } = useBuildingInfo(buildingId);
   const tokenInfo = useTokenInfo(tokenAddress);

   const {
      data: vaultInfo,
      isLoading: isFetchingVaultInfo,
      refetch: refetchVaultInfo,
   } = useVaultData(vaultAddress, tokenInfo?.decimals);

   const { data: tokenPrice, isLoading: isFetchingTokenPrice } = useTokenPrice(
      tokenAddress,
      tokenInfo?.decimals,
   );

   const { data: userRewards } = useUserRewards(vaultAddress, vaultInfo?.rewardTokens[0]);

   const { stake, unstake, isDepositing, isWithdrawing } = useStakingTransactions(
      tokenAddress,
      vaultAddress,
   );

   const tvl = (vaultInfo?.totalStakedTokens || 0) * (tokenPrice || 0);
   const tokenBalance = tokenInfo?.balanceOf
      ? Number(ethers.formatUnits(tokenInfo.balanceOf, tokenInfo.decimals || 18))
      : undefined;

   const handleStake = async ({ amount }: { amount: number }) => {
      await stake({ amount });
      await refetchVaultInfo();
   };
   const handleUnstake = async ({ amount }: { amount: number }) => {
      await unstake({ amount });
      await refetchVaultInfo();
   };

   return {
      loadingState: {
         isDepositing,
         isWithdrawing,
         isFetchingTokenInfo: tokenInfo?.isLoading || false,
         isFetchingVaultInfo,
         isFetchingTreasuryAddress: isFetchingAddresses,
         isFetchingVaultAddress: isFetchingAddresses,
         isFetchingTokenPrice,
      },

      treasuryAddress,
      vaultAddress,
      tokenAddress,
      tokenBalance,

      totalStakedTokens: vaultInfo?.totalStakedTokens,
      userStakedTokens: vaultInfo?.userStakedTokens,
      rewardTokens: vaultInfo?.rewardTokens || [],
      userRewards,

      tokenPriceInUSDC: tokenPrice,
      tvl,

      stakeTokens: handleStake,
      unstakeTokens: handleUnstake,
   };
};

const useTokenPrice = (tokenAddress: string | undefined, tokenDecimals: number | undefined) => {
   const { readContract } = useReadContract();
   const { decimals: usdcDecimals } = useTokenInfo(USDC_ADDRESS);

   return useQuery({
      queryKey: ["TOKEN_PRICE", tokenAddress],
      queryFn: async () => {
         if (!tokenAddress || !tokenDecimals || !usdcDecimals) return 0;

         const amountIn = ethers.parseUnits("1", tokenDecimals);
         const path = [tokenAddress, USDC_ADDRESS];

         const amountsOut = await readContract({
            address: UNISWAP_ROUTER_ADDRESS,
            abi: uniswapRouterAbi,
            functionName: "getAmountsOut",
            args: [amountIn, path],
         });

         const usdcAmountEquivalent = BigInt(amountsOut[1]);
         return Number(usdcAmountEquivalent) / 10 ** usdcDecimals;
      },
      enabled: Boolean(tokenAddress) && Boolean(tokenDecimals) && Boolean(usdcDecimals),
   });
};

const useVaultData = (vaultAddress: string | undefined, tokenDecimals: number | undefined) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();

   return useQuery({
      queryKey: ["VAULT_INFO", vaultAddress, evmAddress],
      queryFn: async (): Promise<VaultInfo | null> => {
         if (!vaultAddress || !evmAddress || !tokenDecimals) return null;

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
            totalStakedTokens: Number(totalAssets) / 10 ** tokenDecimals,
            userStakedTokens: Number(myBalance) / 10 ** tokenDecimals,
            rewardTokens,
         };
      },
      enabled: Boolean(vaultAddress) && Boolean(evmAddress) && Boolean(tokenDecimals),
   });
};

const useUserRewards = (
   vaultAddress: string | undefined,
   rewardTokenAddress: string | undefined,
) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();

   return useQuery({
      queryKey: ["USER_REWARDS", rewardTokenAddress, evmAddress],
      queryFn: async () => {
         if (!vaultAddress || !rewardTokenAddress || !evmAddress) return "0";

         const [rewards, rewardsDecimals] = await Promise.all([
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "getAllRewards",
               args: [evmAddress],
            }),
            readContract({
               address: rewardTokenAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         return ethers.formatUnits(BigInt(rewards[0]), rewardsDecimals);
      },
      enabled: Boolean(vaultAddress) && Boolean(rewardTokenAddress) && Boolean(evmAddress),
   });
};

const useStakingTransactions = (
   tokenAddress: string | undefined,
   vaultAddress: string | undefined,
) => {
   const { decimals: tokenDecimals } = useTokenInfo(tokenAddress);
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();
   const { data: evmAddress } = useEvmAddress();

   const parseAmount = (amount: number) => {
      if (!tokenDecimals) throw new Error("Token decimals not available");
      return BigInt(Math.floor(amount * 10 ** tokenDecimals));
   };

   const stake = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         if (!tokenAddress || !vaultAddress || !evmAddress) {
            throw new Error("Required addresses not available");
         }

         const bigIntAmount = parseAmount(amount);

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
   });

   const unstake = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         if (!vaultAddress || !evmAddress) {
            throw new Error("Required addresses not available");
         }

         const bigIntAmount = parseAmount(amount);

         return await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, vaultAddress),
               abi: basicVaultAbi,
               functionName: "withdraw",
               args: [bigIntAmount, evmAddress, evmAddress],
            }),
         );
      },
   });

   return {
      stake: stake.mutateAsync,
      unstake: unstake.mutateAsync,
      isDepositing: stake.isPending,
      isWithdrawing: unstake.isPending,
   };
};
