"use client";

import { convertBuildingNFTsData, readBuildingsList } from "@/services/buildingService";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingInfo, fetchBuildingNFTsMetadata, readBuildingDetails } from "./helpers";
import { getTokenBalanceOf, getTokenDecimals, getTokenName } from "@/services/erc20Service";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";

export function useBuildings() {
   const { data: evmAddress } = useEvmAddress();
   const { data: buildingsList } = useQuery({
      queryKey: ["buildingsList"],
      queryFn: async () => {
         const buildings = await readBuildingsList();
         const buildingsList: `0x${string}`[][] = await buildings.slice(-1)[0];
         const { buildingAddressesProxiesData, buildingNFTsData } = await fetchBuildingNFTsMetadata(buildingsList?.map(building => building[0]), []);

         return convertBuildingNFTsData(
            buildingNFTsData.map((data, id) => ({
               ...data,
               address: buildingAddressesProxiesData[id][0][0],
               copeIpfsHash: buildingAddressesProxiesData[id][0][2],
            })),
         )
      },
      enabled: true,
   });

   const { data: buildingsInfo } = useQuery({
      queryKey: ["buildingsInfo"],
      queryFn: async () => {
         if (buildingsList && buildingsList.length > 0) {
            const buildingsInfo = await Promise.allSettled(
               buildingsList?.map((building) => readBuildingDetails(building.address!))
            );

            return buildingsInfo.map((info) => ({
               buildingAddress: (info as any).value[0][0],
               acAddress: (info as any).value[0][8],
               tokenAddress: (info as any).value[0][4],
            }));
         }
      },
      enabled: !!buildingsList?.length,
   });

   const { data: buildingsTokensInfo } = useQuery({
      queryKey: ["buildingsTokensInfo"],
      queryFn: async () => {
         if (buildingsInfo) {
            const buildingTokenNames = await Promise.allSettled(
               buildingsInfo?.map((info) => getTokenName(info.tokenAddress!))
            );
            const buildingTokenDecimals = await Promise.allSettled(
               buildingsInfo?.map((info) => getTokenDecimals(info.tokenAddress!))
            );
            const buildingTokenBalances = await Promise.allSettled(
               buildingsInfo?.map((info) => getTokenBalanceOf(info.tokenAddress!, evmAddress))
            );

            return buildingsInfo.map((info, index) => ({
               tokenAddress: info.tokenAddress,
               tokenName: (buildingTokenNames[index] as any).value[0],
               tokenDecimals: (buildingTokenDecimals[index] as any).value[0],
               tokenBalance: (buildingTokenBalances[index] as any).value[0],
            }));
         }
      },
      enabled: !!buildingsInfo?.length,
   });

   return {
      buildings: buildingsList,
      buildingsTokensInfo,
      buildingsInfo,
   };
}

export const useBuilding = (id: string) => {
   const query = useQuery({
      queryKey: ["building", id],
      queryFn: () => fetchBuildingInfo(id),
      enabled: !!id,
   });

   return query;
};
