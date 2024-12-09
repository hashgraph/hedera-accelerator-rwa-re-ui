import { mockSliceTokens, mockTokenToBuildingMap } from "@/consts/props";

export async function getSliceTokens(sliceName: string) {
  return mockSliceTokens;
}

export async function getBuildingForToken(tokenAddress: string) {
  return mockTokenToBuildingMap[tokenAddress];
}
