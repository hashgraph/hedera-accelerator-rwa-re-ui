import { BuildingFormProps } from "./types";
import { pinata } from "@/utils/pinata";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import {
   AUTO_COMPOUNDER_FACTORY_ADDRESS,
   BUILDING_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { isEmpty, last } from "lodash";
import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";

export const transformValuesToContractFormat = (
   values: BuildingFormProps,
   imageIpfsHash: string,
) => ({
   name: values.info.buildingTitle,
   description: values.info.buildingDescription,
   image: imageIpfsHash,
   purchasedAt: values.info.buildingPurchaseDate,
   attributes: [
      {
         trait_type: "constructedYear",
         value: values.info.buildingConstructedYear,
      },
      { trait_type: "type", value: values.info.buildingType },
      { trait_type: "location", value: values.info.buildingLocation },
      { trait_type: "locationType", value: values.info.buildingLocationType },
      {
         trait_type: "tokenSupply",
         value: values.info.buildingTokenSupply.toString(),
      },
   ],
   cope: {
      construction: {
         materials: values.info.copeConstructionMaterials,
         yearBuilt: values.info.copeConstructionYearBuilt,
         roofType: values.info.copeConstructionRoofType,
         numFloors: values.info.copeConstructionNumFloors,
      },
      occupancy: {
         type: values.info.copeOccupancyType,
         percentageOccupied: values.info.copeOccupancyPercentage,
      },
      protection: {
         fire: values.info.copeProtectionFire,
         sprinklers: values.info.copeProtectionSprinklers,
         security: values.info.copeProtectionSecurity,
      },
      exposure: {
         nearbyRisks: values.info.copeExposureNearbyRisks,
         floodZone: values.info.copeExposureFloodZone,
      },
   },
});

export const uploadBuildingInfoToPinata = async (
   values: BuildingFormProps,
   imageIpfsHash: string,
) => {
   const finalJson = transformValuesToContractFormat(values, imageIpfsHash);

   const sanitizedBuildingName = values.info.buildingTitle.replace(/\s+/g, "-").toLowerCase();

   const keyRequest = await fetch("/api/pinataKey");
   const keyData = await keyRequest.json();
   const { IpfsHash } = await pinata.upload
      .json(finalJson, {
         metadata: { name: `Building-${sanitizedBuildingName}` },
      })
      .key(keyData.JWT);

   return IpfsHash;
};

export const waitForBuildingAddress = async () => {
   return new Promise((resolve, reject) => {
      const unsubscribe = watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewBuilding",
         onLogs: (data) => {
            unsubscribe();
            const buildingAddress = data[0]?.args?.[0];
            if (isEmpty(buildingAddress)) {
               reject("Building address is empty");
            }
            resolve(buildingAddress);
         },
      });
   });
};

export const waitForTokenAddress = async (buildingAddress) => {
   return new Promise((resolve, reject) => {
      const unsubscribe = watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewERC3643Token",
         onLogs: (data) => {
            const tokenAddress: any = data.find((log: any) => log.args[1] === buildingAddress);

            if (isEmpty(tokenAddress)) {
               reject("Token address is empty");
            }
            unsubscribe();
            resolve(tokenAddress.args[0]);
         },
      });
   });
};

export const waitForTreasuryAddress = async (buildingAddress: stirng) => {
   return new Promise((resolve, reject) => {
      const unsubscribe = watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewTreasury",
         onLogs: (data) => {
            const buildingTreasury: any = data.find((log: any) => log.args[1] === buildingAddress);

            if (isEmpty(buildingTreasury)) {
               reject("Treasury address is empty");
            }
            unsubscribe();
            resolve(buildingTreasury.args[0]);
         },
      });
   });
};

export const waitForGovernanceAddress = async (buildingAddress: stirng) => {
   return new Promise((resolve, reject) => {
      const unsubscribe = watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewGovernance",
         onLogs: (data) => {
            console.log(data, "governance info");
            const buildingGovernance: any = data.find(
               (log: any) => log.args[1] === buildingAddress,
            );

            if (isEmpty(buildingGovernance)) {
               reject("Governance address is empty");
            }
            unsubscribe();
            resolve(buildingGovernance.args[0]);
         },
      });
   });
};

export const waitForAutoCompounderAddress = async (vaultAddress: stirng) => {
   return new Promise((resolve, reject) => {
      const unsubscribe = watchContractEvent({
         address: AUTO_COMPOUNDER_FACTORY_ADDRESS,
         abi: autoCompounderFactoryAbi,
         eventName: "AutoCompounderDeployed",
         onLogs: (data) => {
            const autoCompounder: any = data.find((log: any) => log.args[1] === vaultAddress);

            if (isEmpty(autoCompounder)) {
               reject("AutoCompounder address is empty");
            }
            unsubscribe();
            resolve(autoCompounder.args[0]);
         },
      });
   });
};
