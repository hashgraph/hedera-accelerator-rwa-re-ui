import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import {
   useEvmAddress,
   useReadContract,
   useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { useATokenDeployFlow } from "@/hooks/vault/useATokenDeployFlow";
import { useState } from "react";
import {
   BuildingFormProps,
   BuildingMinorStep,
   MajorBuildingStep,
   MinorBuildingStep,
   TypedServerError,
   BuildingErrors,
} from "@/components/Admin/buildingManagement/types";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { tryCatch } from "@/services/tryCatch";
import { uploadBuildingInfoToPinata } from "@/components/Admin/buildingManagement/helpers";
import { ContractId } from "@hashgraph/sdk";
import { getNewBuildingAddress } from "./helpers";

export const useBuildingOrchestration = () => {
   const { uploadImage } = useUploadImageToIpfs();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();

   const [currentDeploymentStep, setCurrentDeploymentStep] = useState<
      [MajorBuildingStep | null, MinorBuildingStep | null]
   >([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);

   const handleSubmitBuilding = async (values: BuildingFormProps) => {
      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);
      const { data: imageIpfsHash } = await tryCatch(
         uploadImage(values.info.buildingImageIpfsFile),
      );

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_COPE]);
      const { data: buildingMetadataIpfs } = await tryCatch(
         uploadBuildingInfoToPinata(values, imageIpfsHash),
      );

      const buildingDetails = {
         tokenURI: buildingMetadataIpfs,
         tokenName: values.token.tokenName,
         tokenSymbol: values.token.tokenSymbol,
         tokenDecimals: values.token.tokenDecimals,
         treasuryReserveAmount: values.treasuryAndGovernance.reserve,
         treasuryNPercent: values.treasuryAndGovernance.npercentage,
         governanceName: values.treasuryAndGovernance.governanceName,
         vaultShareTokenName: values.treasuryAndGovernance.shareTokenName,
         vaultShareTokenSymbol: values.treasuryAndGovernance.shareTokenSymbol,
         vaultFeeReceiver: values.treasuryAndGovernance.feeReceiverAddress,
         vaultFeeToken: values.treasuryAndGovernance.feeToken,
         vaultFeePercentage: values.treasuryAndGovernance.feePercentage,
         vaultCliff: 30,
         vaultUnlockDuration: 60,
      };

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_BUILDING]);
      const { data: building, error } = await tryCatch(
         executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
               abi: buildingFactoryAbi,
               functionName: "newBuilding",
               args: [buildingDetails],
            }),
         ),
      );

      return building;
   };

   const deployBuilding = async (buildingDetails) => {
      await executeTransaction(() =>
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "newBuilding",
            args: [buildingDetails],
         }),
      );
      return getNewBuildingAddress();
   };

   return {
      currentDeploymentStep,
      submitBuilding: handleSubmitBuilding,
   };
};
