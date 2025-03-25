import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { readContract } from "@/services/contracts/readContract";
import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { useEffect, useState } from "react";

const readSymbol = (tokenAddress: `0x${string}`) =>
   readContract({
      abi: tokenAbi,
      functionName: "symbol",
      address: tokenAddress.toString(),
      args: [],
   });

const readSliceAllocation = (sliceAddress: `0x${string}`) =>
   readContract({
      abi: sliceAbi,
      functionName: "allocations",
      address: sliceAddress,
      args: [],
   });

export const useSliceData = (
   sliceAddress: `0x${string}`,
   buildingDeployedTokens: BuildingToken[],
) => {
   const [sliceAllocations, setSliceAllocations] = useState<SliceAllocation[]>([]);
   const [sliceBuildings, setSliceBuildings] = useState<BuildingToken[]>([]);

   useEffect(() => {
      if (sliceAddress) {
         readSliceAllocation(sliceAddress).then((data) => {
            const allocationTokenNames = Promise.all(
               data
                  .filter((allocationLog: any) => allocationLog.length > 0)
                  .map((allocationLog: any) => readSymbol(allocationLog?.[0]?.[0])),
            );

            allocationTokenNames.then((tokenNames) => {
               setSliceAllocations(
                  data
                     .filter((allocationLog: any) => allocationLog.length > 0)
                     .map((allocationLog: any, index: number) => ({
                        aToken: allocationLog?.[0]?.[0],
                        aTokenName: tokenNames[index][0],
                        buildingToken: allocationLog?.[0]?.[1],
                        idealAllocation: 100, // todo: how to calculate?
                        actualAllocation: allocationLog?.[0]?.[2],
                     })),
               );
            });
         });
      }
   }, [sliceAddress]);

   useEffect(() => {
      if (buildingDeployedTokens?.length > 0 && sliceAllocations?.length > 0) {
         setSliceBuildings(
            sliceAllocations.map(
               (allocation) =>
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  buildingDeployedTokens.find(
                     (tok) => tok.tokenAddress === allocation.buildingToken,
                  )!,
            ),
         );
      }
   }, [buildingDeployedTokens, sliceAllocations]);

   return { sliceAllocations, sliceBuildings };
};
