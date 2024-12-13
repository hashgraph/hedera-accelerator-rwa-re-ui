import { buildings } from "@/consts/buildings";
import { mockTokenToBuildingMap } from "@/consts/mockData";


export async function getBuildingForToken(tokenAddress: string) {
  const mapping = mockTokenToBuildingMap[tokenAddress];
  if (!mapping) return null;

  const buildingData = buildings.find((b) => b.id === mapping.buildingId);
  if (!buildingData) return null;

  return {
    nftId: buildingData.id,
    name: buildingData.title,
    image: buildingData.imageUrl,
    location: buildingData.info.demographics.location,
  };
}

export async function getBuildingValuation(buildingId: number): Promise<number> {
  // TODO: replace mock. with hopefully some actual logic in the near future
  return 10000;
}
