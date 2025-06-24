import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTokenBalanceOf, getTokenDecimals, getTokenName, getTokenSymbol } from "@/services/erc20Service";
import { readSliceAllocations, readSliceBaseToken } from "@/services/sliceService";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { prepareStorageIPFSfileURL } from "@/utils/helpers";
import { readBuildingDetails } from "./useBuildings";
import { fetchJsonFromIpfs } from "@/services/ipfsService";

const calculateIdealAllocation = (totalAllocationsCount: number) => {
   switch (totalAllocationsCount) {
      case 1:
         return 100;
      default:
         return 100 / totalAllocationsCount;
   } 
};

export const useSliceData = (
   sliceAddress: `0x${string}`,
   buildingDeployedTokens?: BuildingToken[],
) => {
   const [sliceBuildings, setSliceBuildings] = useState<BuildingToken[]>([]);
   const { data: evmAddress } = useEvmAddress();
   
   const { data: sliceBaseToken } = useQuery<`0x${string}`>({
      queryKey: ["sliceBaseToken"],
      queryFn: async () => {
         const baseToken = await readSliceBaseToken(sliceAddress);

         return baseToken[0]
      },
      enabled: !!sliceAddress,
   });

    const { data: sliceBuildingsDetails } = useQuery({
      queryKey: ["sliceBuildingsDetails", sliceBuildings.map((b) => b.buildingAddress)],
      queryFn: async () => {
         const buildings = await Promise.all(sliceBuildings.map((b) => readBuildingDetails(b.buildingAddress)));
         const buildingsIPFSData = await Promise.all(buildings.map((b) => fetchJsonFromIpfs(b[0][2])));

         return buildingsIPFSData.map((b) => ({
            ...b,
            image: prepareStorageIPFSfileURL(b.image?.replace("ipfs://", "")),
         }));
      },
      enabled: sliceBuildings?.length > 0,
      initialData: [],
    });

   const { data: sliceTokenInfo } = useQuery<any>({
      queryKey: ["sliceTokenInfo"],
      queryFn: async () => {
         if (sliceBaseToken) {
            const tokenBalance: any = await getTokenBalanceOf(sliceBaseToken, evmAddress);
            const tokenName = await getTokenName(sliceBaseToken);
            const tokenDecimals = await getTokenDecimals(sliceBaseToken);

            return {
               tokenBalance,
               tokenName,
               tokenDecimals,
            };
         }
      },
      enabled: !!sliceBaseToken && !!evmAddress,
   });

   const { data: sliceAllocations } = useQuery<SliceAllocation[]>({
      refetchInterval: 10000,
      queryKey: ["sliceAllocations"],
      queryFn: async () => {
         const allocations = await readSliceAllocations(sliceAddress);
         const allocationTokenNames = await Promise.allSettled(
            allocations[0]
               .filter((allocationLog: any[]) => allocationLog.length > 0)
               .map((allocationLog: any[]) => getTokenSymbol(allocationLog[0])),
         );
         
         return allocations[0]
            .filter((allocationLog: any) => allocationLog[0].length > 0)
            .map((allocationLog: any, index: number) => ({
               aToken: allocationLog[0],
               aTokenName: (allocationTokenNames[index] as { value: any[] }).value[0],
               buildingToken: allocationLog[1],
               idealAllocation: calculateIdealAllocation(allocations[0].length),
               actualAllocation: (Number(allocationLog[2]) / 100),
            }));
      },
      enabled: !!sliceAddress,
      initialData: [],
   });

   useEffect(() => {
      if (sliceAllocations?.length) {
         if (buildingDeployedTokens && buildingDeployedTokens?.length > 0 && sliceAllocations?.length > 0) {
            setSliceBuildings(
               sliceAllocations.map(
                  (allocation) =>
                     buildingDeployedTokens.find(
                        (tok) => tok.tokenAddress === allocation.buildingToken,
                     )!,
               ),
            );
         }
      }
   }, [buildingDeployedTokens, sliceAllocations]);

   return { sliceAllocations, sliceBaseToken, sliceTokenInfo, sliceBuildings, sliceBuildingsDetails };
};
