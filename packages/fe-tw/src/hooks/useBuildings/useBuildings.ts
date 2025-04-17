"use client";

import { useCallback, useEffect, useState } from "react";

import { convertBuildingNFTsData, readBuildingsList } from "@/services/buildingService";
import type { BuildingData } from "@/types/erc3643/types";
import { useQuery } from "@tanstack/react-query";
import { fetchBuildingInfo, fetchBuildingNFTsMetadata } from "./helpers";

export function useBuildings() {
   const [buildingsList, setBuildingsList] = useState<`0x${string}`[][]>([]);
   const [buildings, setBuildings] = useState<BuildingData[]>([]);
   const buildingTokens: any[] = [];
   const buildingTokenNames: any[] = [];

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

   useEffect(() => {
      if (buildingsList?.length) {
         fetchBuildingNFTs();
      }
   }, [buildingsList, fetchBuildingNFTs]);

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
