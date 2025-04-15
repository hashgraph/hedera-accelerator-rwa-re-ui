import { isEmpty, isNumber } from "lodash";
import { ethers } from "ethers";
import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useQuery } from "@tanstack/react-query";
import { readBuildingDetails } from "@/hooks/useBuildings";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { getTokenBalanceOf, getTokenDecimals } from "@/services/erc20Service";
import { QueryKeys } from "@/types/queries";
import { readUniswapPairs } from "@/hooks/useSwapsHistory";
import { USDC_ADDRESS } from "@/services/contracts/addresses";

export const useBuildingInfo = (id?: string) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();

   const { data: buildingDetails, isLoading: buildingLoading } = useQuery({
      queryKey: ["BUILDING_DETAILS", id],
      queryFn: async () => {
         const buildingInfo = await readBuildingDetails(id);
         return {
            address: buildingInfo[0][0],
            tokenAddress: buildingInfo[0][4],
            treasuryAddress: buildingInfo[0][5],
            governanceAddress: buildingInfo[0][6],
         };
      },
      enabled: Boolean(id),
   });

   const { data: vaultAddress, isLoading: vaultLoading } = useQuery({
      queryKey: ["VAULT_ADDRESS", buildingDetails?.treasuryAddress],
      queryFn: () =>
         readContract({
            address: buildingDetails?.treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "vault",
         }),
      enabled: Boolean(buildingDetails?.treasuryAddress),
   });

   const { data: tokenAmountMinted, isLoading: tokenLoading } = useQuery({
      queryKey: ["TOKEN_AMOUNT", buildingDetails?.tokenAddress, evmAddress],
      queryFn: async () => {
         const [decimals, tokenAmountMinted] = await Promise.all([
            getTokenDecimals(buildingDetails?.tokenAddress),
            getTokenBalanceOf(buildingDetails?.tokenAddress, evmAddress),
         ]);

         const tokenAmountMintedFormatted = tokenAmountMinted / 10 ** decimals;

         return tokenAmountMintedFormatted;
      },
      enabled: Boolean(buildingDetails?.tokenAddress) && Boolean(evmAddress),
   });

   const { data: pairAddressData, isLoading: pairInfoLoading } = useQuery({
      queryKey: [QueryKeys.ReadUniswapPairs],
      enabled: Boolean(buildingDetails?.tokenAddress),
      queryFn: () => readUniswapPairs(buildingDetails?.tokenAddress, USDC_ADDRESS),
   });

   return {
      ...buildingDetails,
      vaultAddress,
      tokenAmountMinted,
      liquidityPairAddress: pairAddressData?.[0],
      isLoading: buildingLoading || vaultLoading || tokenLoading || pairInfoLoading,
   };
};

export const getBuildingStateSummary = (buildingDetails) => {
   return {
      buildingDeployed:
         !isEmpty(buildingDetails?.address) && buildingDetails?.address !== ethers.ZeroAddress,
      tokenDeployed:
         !isEmpty(buildingDetails?.tokenAddress) &&
         buildingDetails?.tokenAddress !== ethers.ZeroAddress,
      tokensMinted:
         isNumber(buildingDetails?.tokenAmountMinted) && buildingDetails?.tokenAmountMinted !== 0,
      treasuryDeployed:
         !isEmpty(buildingDetails?.treasuryAddress) &&
         buildingDetails?.treasuryAddress !== ethers.ZeroAddress,
      governanceDeployed:
         !isEmpty(buildingDetails?.governanceAddress) &&
         buildingDetails?.governanceAddress !== ethers.ZeroAddress,
      vaultDeployed:
         !isEmpty(buildingDetails?.vaultAddress) &&
         buildingDetails?.vaultAddress !== ethers.ZeroAddress,
   };
};
