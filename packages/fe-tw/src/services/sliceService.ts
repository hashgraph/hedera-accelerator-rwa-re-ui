import { getSliceTokens, getBuildingForToken } from "@/services/mockSliceService";

export async function getSliceTokensData(sliceName: string) {
  const tokens = await getSliceTokens(sliceName);
  const tokensWithBuilding = await Promise.all(
    tokens.map(async (token) => {
      const building = await getBuildingForToken(token.tokenAddress);
      return {
        ...token,
        building,
      };
    })
  );
  return tokensWithBuilding;
}
