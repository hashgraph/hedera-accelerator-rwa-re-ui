"use client";

import { useEffect, useState, useCallback } from "react";

import { convertBuildingNFTsData, readBuildingsList } from "@/services/buildingService";
import type { BuildingToken, TokenDecimals } from "@/types/erc3643/types";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingInfo, fetchBuildingNFTsMetadata } from "./helpers";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { getTokenDecimals, getTokenName } from "@/services/erc20Service";

export function useBuildings() {
   const [buildingTokens, setBuildingTokens] = useState<BuildingToken[]>([]);
   const [tokenDecimals, setTokenDecimals] = useState<TokenDecimals>({});
   
   const fetchBuildingTokenDecimals = useCallback(async () => {
      buildingTokens.forEach((tok) => {
         getTokenDecimals(tok.tokenAddress).then((tokenDecimals) => {
            setTokenDecimals((prev) => ({
               ...prev,
               [tok.tokenAddress]: tokenDecimals[0],
            }));
         });
      });
   }, [buildingTokens, setTokenDecimals]);
   
   const watchBuildingTokens = () => {
      const watchers = buildingsListData?.map(listItem => watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewERC3643Token",
         args: [listItem.address as `0x${string}`],
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
         watchers?.forEach(unwatch => {
            unwatch();
         });
      };
   };

   const { data: buildingsListData } = useQuery({
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

   const { data: buildingTokenNamesData } = useQuery({
      queryKey: ["buildingTokenNames", buildingTokens.map(tok => tok.tokenAddress)],
      queryFn: async () => {
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
      if (!!buildingsListData?.length) {
         return watchBuildingTokens();
      }
   }, [buildingsListData?.length]);

   useEffect(() => {
      if (!!buildingTokens?.length) {
         fetchBuildingTokenDecimals();
      }
   }, [buildingTokens?.length]);

   return {
      buildings: buildingsListData,
      buildingTokenNames: buildingTokenNamesData,
      buildingTokenDecimals: tokenDecimals,
      buildingTokens,
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
