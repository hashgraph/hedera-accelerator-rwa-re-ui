"use client";

import { useEffect, useState } from "react";

import { convertBuildingNFTsData, readBuildingsList } from "@/services/buildingService";
import type { BuildingToken } from "@/types/erc3643/types";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingInfo, fetchBuildingNFTsMetadata } from "./helpers";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { getTokenName } from "@/services/erc20Service";

export function useBuildings() {
   const [buildingTokens, setBuildingTokens] = useState<BuildingToken[]>([]);

   const watchBuildingTokens = () => {
      if (buildingsListData?.length) {
         const watchers = buildingsListData.map(listItem => watchContractEvent({
            address: BUILDING_FACTORY_ADDRESS,
            abi: buildingFactoryAbi,
            eventName: "NewERC3643Token",
            args: [listItem[0] as `0x${string}`],
            onLogs: (data) => {
               setBuildingTokens((prev) => [
                  ...prev,
                  ...data.filter(tok => !prev.find(_tok => _tok.tokenAddress === (tok as any).args[0] as `0x${string}`)).map(tok => ({
                     tokenAddress: (tok as any).args[0] as `0x${string}`,
                     buildingAddress: (tok as any).args[1] as `0x${string}`
                  }))
               ]);
            },
         }));

         return () => {
            watchers.forEach(unwatch => {
               unwatch();
            });
         };
      }
   };

   const { data: buildingsListData } = useQuery({
      queryKey: ["buildings"],
      queryFn: async () => {
         const buildings = await readBuildingsList();
         const buildingsList: `0x${string}`[][] = await buildings.slice(-1)[0];

         return buildingsList;
      },
      enabled: true,
   });

   const { data: buildingsData } = useQuery({
      queryKey: ["buildingNFTs"],
      queryFn: async () => {
         if (buildingsListData?.length) {
            const { buildingAddressesProxiesData, buildingNFTsData } = await fetchBuildingNFTsMetadata(buildingsListData?.map(building => building[0]), []);

            return convertBuildingNFTsData(
               buildingNFTsData.map((data, id) => ({
                  ...data,
                  address: buildingAddressesProxiesData[id][0][0],
                  copeIpfsHash: buildingAddressesProxiesData[id][0][2],
               })),
            )
         }

         return [];
      },
      enabled: !!buildingsListData?.length,
      initialData: [],
   });

   const { data: buildingTokenNamesData } = useQuery({
      queryKey: ["buildingTokenNames", buildingTokens.map(tok => tok.tokenAddress)],
      queryFn: async () => {
         console.log('buildingTokenNames', buildingTokens)

         const buildingTokenNames = await Promise.all(buildingTokens.map(tok => getTokenName(tok.tokenAddress)));
         const tokenNames: {
            [key: `0x${string}`]: string,
         } = {};

         buildingTokenNames.forEach((tok, tokId) => {
            tokenNames[buildingTokens[tokId].tokenAddress] = tok[0];
         });

         return tokenNames;
      },
      enabled: !!buildingTokens?.length,
      initialData: {},
   });

   useEffect(() => {
      if (!!buildingsData?.length) {
         return watchBuildingTokens();
      }
   }, [buildingsData?.length]);

   return { buildings: buildingsData, buildingTokens, buildingTokenNames: buildingTokenNamesData };
}

export const useBuilding = (id: string) => {
   const query = useQuery({
      queryKey: ["building", id],
      queryFn: () => fetchBuildingInfo(id),
      enabled: !!id,
   });

   return query;
};
