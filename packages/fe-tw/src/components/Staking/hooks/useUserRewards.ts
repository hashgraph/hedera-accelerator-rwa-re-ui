import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

export const useUserRewards = (
   vaultAddress: string | undefined,
   rewardTokenAddress: string | undefined,
   autoCompounderAddress: string | undefined,
) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();

   return useQuery({
      queryKey: ["USER_REWARDS", rewardTokenAddress, evmAddress],
      queryFn: async () => {
         if (!vaultAddress || !rewardTokenAddress || !evmAddress) return "0";

         const [rewards, rewardsDecimals, autoCompounderRewards] = await Promise.all([
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
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "getAllRewards",
               args: [autoCompounderAddress],
            }),
         ]);

         return ethers.formatUnits(BigInt(rewards[0]), rewardsDecimals);
      },
      enabled: Boolean(vaultAddress) && Boolean(rewardTokenAddress) && Boolean(evmAddress),
   });
};
