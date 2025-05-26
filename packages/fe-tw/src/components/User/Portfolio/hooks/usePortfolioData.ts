import { useQuery } from "@tanstack/react-query";
import { isEmpty, map } from "lodash";
import { readBuildingDetails, readBuildingsList } from "@/services/buildingService";
import { getTokenBalanceOf, getTokenDecimals, getTokenSymbol } from "@/services/erc20Service";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { PortfolioToken } from "@/components/User/Portfolio/types";
import { ethers } from "ethers";
import { readContract } from "@/services/contracts/readContract";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { getUserReward } from "../helpers";

export const usePortfolioData = () => {
   const { data: evmAddress } = useEvmAddress();

   return useQuery<PortfolioToken[] | null>({
      queryKey: ["PORTFOLIO_TOKENS", evmAddress],
      queryFn: async () => {
         if (!evmAddress) return null;

         const buildingsData = await readBuildingsList();
         const buildingAddresses = buildingsData?.[0]
            ? map(buildingsData[0], (building) => building?.[0])
            : [];

         if (!buildingAddresses || buildingAddresses.length === 0) return [];

         const portfolioDataPromises = buildingAddresses.map(async (buildingAddress) => {
            if (!buildingAddress) return null;

            const buildingInfo = await readBuildingDetails(buildingAddress);
            const tokenAddress = buildingInfo?.[0]?.[4];
            const treasuryAddress = buildingInfo?.[0]?.[5];

            const [vaultAddress] = await readContract({
               address: treasuryAddress,
               abi: buildingTreasuryAbi,
               functionName: "vault",
            });

            let rewardToken = await readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "getRewardTokens",
            });
            rewardToken = rewardToken[0];

            if (!tokenAddress) return null;

            const [[tokenBalance], [tokenDecimals], symbol, pendingRewards] = await Promise.all([
               getTokenBalanceOf(tokenAddress, evmAddress),
               getTokenDecimals(tokenAddress),
               getTokenSymbol(tokenAddress),
               getUserReward(vaultAddress, evmAddress, rewardToken),
            ]);

            const tokenBalanceFormatted = Number(ethers.formatUnits(tokenBalance, tokenDecimals));

            return {
               tokenAddress,
               balance: tokenBalanceFormatted,
               symbol: String(symbol || "N/A"),
               exchangeRateUSDC: 1,
               pendingRewards,
            };
         });

         const portfolioDataResults = await Promise.all(portfolioDataPromises);

         return portfolioDataResults as PortfolioToken[];
      },
      enabled: !!evmAddress,
   });
};
