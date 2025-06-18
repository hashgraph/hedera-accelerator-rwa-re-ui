import { mockSliceTokens } from "@/consts/allocations";
import { readContract } from "@/services/contracts/readContract";
import { getBuildingForToken } from "./buildingService";
import { sliceAbi } from "./contracts/abi/sliceAbi";

/**
 * Reads slice details from SC.
 * @param address Slice address
 */
export const readSliceMetdataUri = (sliceAddress: `0x${string}`) =>
   readContract({
      functionName: "metadataUri",
      address: sliceAddress,
      abi: sliceAbi,
      args: [],
   });

export const readSliceAllocations = (sliceAddress: `0x${string}`) =>
   readContract({
      abi: sliceAbi,
      functionName: "allocations",
      address: sliceAddress,
      args: [],
   });

export const readSliceBaseToken = (sliceAddress: `0x${string}`) =>
   readContract({
      abi: sliceAbi,
      functionName: "baseToken",
      address: sliceAddress,
      args: [],
   });

export async function getSliceTokensData(sliceName: string) {
   // TODO: replace mock
   const tokens = mockSliceTokens;

   const tokensWithBuilding = await Promise.all(
      tokens.map(async (token) => {
         const building = await getBuildingForToken(token.tokenAddress);
         return {
            ...token,
            building: building ?? {
               nftId: null,
               name: "Unknown Building",
               image: "assets/dome.jpeg",
               location: "Unknown",
            },
         };
      }),
   );

   return tokensWithBuilding;
}

// TODO: replace mock
export async function getSliceValuation(sliceName: string): Promise<number> {
   return 60000;
}

export async function getSliceTokenPrice(sliceName: string): Promise<number> {
   // TODO: replace mock
   return 0.5;
}

export async function getUserSliceBalance(sliceName: string, userAddress: string): Promise<number> {
   // TODO: replace mock
   return 1000;
}

// TODO: actually do smth here, not just a simulated delay
export async function performRebalance(sliceName: string) {
   await new Promise((resolve) => setTimeout(resolve, 2000));
   return true;
}
