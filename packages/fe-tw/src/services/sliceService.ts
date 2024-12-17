import { slices } from "@/consts/slices";
import { mockSliceTokens, mockTokenToBuildingMap } from "@/consts/allocations";
import { getBuildingForToken } from "./buildingService"; 

// TODO: replace with a contract call to SliceFactory contract
export async function getAllSlices() {
  // mocked from slices.ts
  return slices;
}

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
          image: "/default-building.jpg",
          location: "Unknown",
        },
      };
    })
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
