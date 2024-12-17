import { CopeData, copeIpfsData } from "@/consts/cope";
import { buildings } from "@/consts/buildings";

export function getCopeIpfsHashForBuilding(buildingId: string): string | null {
  const building = buildings.find(b => b.id.toString() === buildingId);
  return building?.copeIpfsHash || null;
}

// TODO: replace mock
// fetch COPE data from IPFS
export async function fetchCopeData(ipfsHash: string): Promise<CopeData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
  return copeIpfsData[ipfsHash] || null;
}

// TODO: replace mock
// update COPE data on IPFS
export async function updateCopeData(ipfsHash: string, newData: Partial<CopeData>): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!copeIpfsData[ipfsHash]) return false;

  copeIpfsData[ipfsHash] = {
    ...copeIpfsData[ipfsHash],
    ...newData,
  };
  return true;
}
