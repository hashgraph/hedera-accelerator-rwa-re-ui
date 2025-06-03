import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { useTokenInfo } from "@/hooks/useTokenInfo";

export const useUserRewards = (
   vaultAddress: string | undefined,
   rewardTokenAddress: string | undefined,
   autoCompounderAddress: string | undefined,
) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();
   const { decimals: rewardsDecimals } = useTokenInfo(rewardTokenAddress);

   const autoCompounderQuery = useQuery({
      queryKey: [
         "AUTO_COMPOUNDER_REWARDS",
         rewardTokenAddress,
         autoCompounderAddress,
         vaultAddress,
      ],
      queryFn: async () => {
         const rewards = await readContract({
            address: vaultAddress,
            abi: basicVaultAbi,
            functionName: "getAllRewards",
            args: [autoCompounderAddress],
         });

         return ethers.formatUnits(BigInt(rewards[0]), rewardsDecimals);
      },
      enabled:
         Boolean(vaultAddress) &&
         Boolean(rewardTokenAddress) &&
         Boolean(autoCompounderAddress) &&
         Boolean(rewardsDecimals),
   });

   const vaultQuery = useQuery({
      queryKey: ["VAULT_USER_REWARDS", evmAddress, rewardTokenAddress, vaultAddress],
      queryFn: async () => {
         if (!vaultAddress || !rewardTokenAddress || !evmAddress)
            return { vaultRewards: "0", autoCompounderRewards: "0" };

         const rewards = await readContract({
            address: vaultAddress,
            abi: basicVaultAbi,
            functionName: "getAllRewards",
            args: [evmAddress],
         });

         console.log("rewards", rewards);

         return ethers.formatUnits(BigInt(rewards[0]), rewardsDecimals);
      },
      enabled:
         Boolean(vaultAddress) &&
         Boolean(rewardTokenAddress) &&
         Boolean(evmAddress) &&
         Boolean(rewardsDecimals),
   });

   return {
      vault: vaultQuery,
      autoCompounder: autoCompounderQuery,
   };
};
