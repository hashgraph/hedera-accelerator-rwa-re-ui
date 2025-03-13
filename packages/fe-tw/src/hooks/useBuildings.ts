"use client";

import { useEffect, useState } from "react";

import { buildingFinancialMock } from "@/consts/buildings";
import { readBuildingsList } from "@/services/buildingService";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { readContract } from "@/services/contracts/readContract";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import type {
  BuildingData,
  BuildingNFTAttribute,
  BuildingNFTData,
} from "@/types/erc3643/types";
import { prepareStorageIPFSfileURL } from "@/utils/helpers";

/**
 * Finds one attribute from building data attributes.
 * @param attributes All building attributes
 * @param attributeName Attribute key
 */
const findBuildingAttribute = (
  attributes: BuildingNFTAttribute[],
  attributeName: string,
) => {
  return (
    attributes.find((attr) => attr.trait_type === attributeName)?.value ?? "--"
  );
};

/**
 * Converts original building NFT metadata to a proper readable data format.
 * @param buildingNFTsData Original building NFT JSON
 */
const convertBuildingNFTsData = (
  buildingNFTsData: BuildingNFTData[],
): BuildingData[] => {
  return buildingNFTsData.map((data) => ({
    id: data.address,
    title: data.name,
    description: data.description,
    imageUrl: prepareStorageIPFSfileURL(data.image?.replace("ipfs://", "")),
    cope: data.cope,
    voteItems: [],
    partOfSlices: [],
    allocation: data.allocation,
    purchasedAt: data.purchasedAt,
    address: data.address,
    info: {
      financial: buildingFinancialMock,
      demographics: !data.attributes
        ? {
            constructedYear: "",
            type: "",
            locationType: "",
            size: "",
            location: "",
            state: "",
          }
        : {
            constructedYear: findBuildingAttribute(
              data.attributes,
              "constructedYear",
            ),
            type: findBuildingAttribute(data.attributes, "type"),
            locationType: findBuildingAttribute(
              data.attributes,
              "locationType",
            ),
            size: findBuildingAttribute(data.attributes, "size"),
            location: findBuildingAttribute(data.attributes, "location"),
            state: findBuildingAttribute(data.attributes, "state"),
          },
    },
  }));
};

/**
 * Fetches batch of building NFTs metadata from Pinata.
 * @param buildingsAddresses Buildings addresses
 * @param buildings Buildings exists
 */
export const fetchBuildingNFTsMetadata = async (
  buildingsAddresses: `0x${string}`[],
  buildings: BuildingData[],
) => {
  const buildingAddressesProxiesData = await Promise.all(
    buildingsAddresses
      .filter(
        (address) => !buildings.find((build) => build.address === address),
      )
      .map((address) => readBuildingDetails(address)),
  );
  const buildingNFTsData = await Promise.all(
    buildingAddressesProxiesData
      .filter((proxy) => !!proxy[0][2])
      .map((proxy) => fetchJsonFromIpfs(proxy[0][2])),
  );

  return { buildingAddressesProxiesData, buildingNFTsData };
};

/**
 * Reads building details from SC.
 * @param address Building address
 */
const readBuildingDetails = (address: `0x${string}`) =>
  readContract({
    functionName: "getBuildingDetails",
    address: BUILDING_FACTORY_ADDRESS,
    abi: buildingFactoryAbi,
    args: [address],
  });

export function useBuildings() {
  const [buildingsList, setBuildingsList] = useState<`0x${string}`[][]>([]);
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  const fetchBuildingNFTs = async () => {
    const { buildingNFTsData, buildingAddressesProxiesData } =
      await fetchBuildingNFTsMetadata(
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
  };

  useEffect(() => {
    readBuildingsList().then((data) => {
      setBuildingsList(data.slice(-1)[0]);
    });
  }, []);

  useEffect(() => {
    if (buildingsList?.length) {
      fetchBuildingNFTs();
    }
  }, [buildingsList?.length]);

  return { buildings };
}
