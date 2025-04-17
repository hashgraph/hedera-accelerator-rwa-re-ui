"use client";

import { useCallback, useEffect, useState } from "react";

import { convertBuildingNFTsData, readBuildingsList } from "@/services/buildingService";
import type { BuildingData, BuildingToken } from "@/types/erc3643/types";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingInfo, fetchBuildingNFTsMetadata } from "./helpers";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { getTokenName } from "@/services/erc20Service";

export function useBuildings() {
   const [buildingsList, setBuildingsList] = useState<`0x${string}`[][]>([]);
   const [buildings, setBuildings] = useState<BuildingData[]>([]);
   const [buildingTokens, setBuildingTokens] = useState<BuildingToken[]>([]);
   const [buildingTokenNames, setBuildingTokenNames] = useState<{[key: string]: string}>({});
   const [isWatching, setIsWatching] = useState(false);

   const fetchBuildingTokenNames = useCallback(async () => {
      if (buildingTokens?.length) {
         try {
            const tokenNames = await Promise.all(buildingTokens.map(tok => getTokenName(tok.tokenAddress)));

            tokenNames.forEach((tokName, id) => {
               setBuildingTokenNames(prev => ({
                  ...prev,
                  [buildingTokens[id].tokenAddress]: tokName[0],
               }));
            });
         } catch (err) { }
      }
   }, [buildingTokens]);

   const fetchBuildingNFTs = useCallback(async () => {
      const { buildingNFTsData, buildingAddressesProxiesData } = await fetchBuildingNFTsMetadata(
         buildingsList.map((item) => item[0]),
         buildings,
      );

      setBuildings(
         convertBuildingNFTsData(
            buildingNFTsData.map((data, id) => ({
               ...data,
               address: buildingAddressesProxiesData[id][0][0],
               copeIpfsHash: buildingAddressesProxiesData[id][0][2],
            })),
         ),
      );
   }, [buildingsList]);

   useEffect(() => {
      readBuildingsList().then((data) => {
         setBuildingsList(data.slice(-1)[0]);
      });
   }, []);

   const watchBuildingTokens = () => {
      if (buildingsList?.length) {
         const watchers = buildingsList.map(listItem => watchContractEvent({
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
            if (watchers?.length) {
               watchers.forEach(unwatch => {
                  unwatch();
               });
            }
         };
      }
   };

   useEffect(() => {
      if (buildingsList?.length && !isWatching) {
         setIsWatching(true);
         watchBuildingTokens();
      }
   }, [buildingsList, isWatching]);

   useEffect(() => {
      if (buildingsList?.length) {
         fetchBuildingNFTs();
         watchBuildingTokens();
      }
   }, [buildingsList]);

   useEffect(() => {
      if (buildingTokens?.length) {
         fetchBuildingTokenNames();
      }
   }, [buildingTokens]);

   return { buildings, buildingTokenNames, buildingTokens };
}

export const useBuilding = (id: string) => {
   const query = useQuery({
      queryKey: ["building", id],
      queryFn: () => fetchBuildingInfo(id),
      enabled: !!id,
   });

   return query;
};
