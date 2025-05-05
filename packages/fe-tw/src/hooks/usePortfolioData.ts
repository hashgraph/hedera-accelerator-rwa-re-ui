import { useQuery } from "@tanstack/react-query";
import { map } from "lodash";
import { readBuildingDetails, readBuildingsList } from "@/services/buildingService";
import { getTokenBalanceOf, getTokenDecimals, getTokenSymbol } from "@/services/erc20Service";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { PortfolioToken } from "@/components/User/Portfolio/types";

export const usePortfolioData = () => {
   const { data: evmAddress } = useEvmAddress();

   return useQuery<PortfolioToken[] | null>({
      // Return type updated
      queryKey: ["PORTFOLIO_TOKENS", evmAddress], // More specific query key
      queryFn: async () => {
         if (!evmAddress) return null;

         const buildingsData = await readBuildingsList();
         const buildingAddresses = map(buildingsData?.[0], (building) => building?.[0]);

         if (!buildingAddresses || buildingAddresses.length === 0) return [];

         const buildingsDetails = await Promise.all(
            buildingAddresses.map(async (address) => {
               const buildingInfo = await readBuildingDetails(address);
               return {
                  address: buildingInfo[0][0],
                  tokenAddress: buildingInfo[0][4],
                  treasuryAddress: buildingInfo[0][5],
                  governanceAddress: buildingInfo[0][6],
               };
            }),
         );

         const tokenDataPromises = buildingsDetails.map(async ({ tokenAddress }) => {
            if (!tokenAddress) return null; // Skip if tokenAddress is missing

            const balancePromise = getTokenBalanceOf(tokenAddress, evmAddress);
            const decimalsPromise = getTokenDecimals(tokenAddress);
            const symbolPromise = getTokenSymbol(tokenAddress);

            const [tokenBalance, tokenDecimals, symbol] = await Promise.all([
               balancePromise,
               decimalsPromise,
               symbolPromise,
            ]);

            let calculatedBalance = 0;
            if (typeof tokenDecimals === "number" && tokenDecimals >= 0) {
               calculatedBalance = tokenBalance / 10 ** tokenDecimals;
            } else {
               console.error(`Invalid decimals for token ${tokenAddress}: ${tokenDecimals}`);
            }

            return {
               tokenAddress,
               balance: calculatedBalance,
               symbol: String(symbol || "N/A"), // Handle potential null/undefined symbol
               exchangeRateUSDC: 1, // Placeholder exchange rate
            };
         });

         const tokenBalancesArray = (await Promise.all(tokenDataPromises)).filter(
            Boolean,
         ) as PortfolioToken[]; // Filter out nulls
         const tokensInPortfolio = tokenBalancesArray.filter((token) => token.balance > 0);
         return tokensInPortfolio;
      },
      enabled: !!evmAddress,
   });
};
