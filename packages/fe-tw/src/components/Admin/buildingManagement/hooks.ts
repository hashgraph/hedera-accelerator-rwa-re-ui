import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { useAccountId, useEvmAddress, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { useEffect, useState } from "react";
import {
   BuildingFormProps,
   BuildingMinorStep,
   MajorBuildingStep,
   MinorBuildingStep,
} from "@/components/Admin/buildingManagement/types";
import { BUILDING_FACTORY_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { tryCatch } from "@/services/tryCatch";
import { uploadBuildingInfoToPinata } from "@/components/Admin/buildingManagement/helpers";
import { ContractId } from "@hashgraph/sdk";
import { getNewBuildingAddress, processError } from "./helpers";
import useWriteContract from "@/hooks/useWriteContract";
import { ethers } from "ethers";
import { useTokenInfo } from "@/hooks/useTokenInfo";

export const useBuildingOrchestration = () => {
   const { uploadImage } = useUploadImageToIpfs();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { data: evmAddress } = useEvmAddress();
   const { decimals: usdcDecimals } = useTokenInfo(USDC_ADDRESS);

   const [currentDeploymentStep, setCurrentDeploymentStep] = useState<
      [MajorBuildingStep | null, MinorBuildingStep | null]
   >([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);

   const handleSubmitBuilding = async (values: BuildingFormProps) => {
      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);
      const { data: imageIpfsHash, error: imageError } = await tryCatch(
         uploadImage(values.info.buildingImageIpfsFile!),
      );
      if (imageError) processError(imageError as any);

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_COPE]);
      const { data: buildingMetadataIpfs, error: metadataError } = await tryCatch(
         uploadBuildingInfoToPinata(values, imageIpfsHash!),
      );
      if (metadataError) processError(metadataError as any);

      const buildingDetails = {
         tokenURI: buildingMetadataIpfs,
         tokenName: values.token.tokenName,
         tokenSymbol: values.token.tokenSymbol,
         tokenDecimals: values.token.tokenDecimals,
         tokenMintAmount: ethers.parseUnits(
            String(values.token.mintBuildingTokenAmount),
            values.token.tokenDecimals,
         ),
         treasuryReserveAmount: ethers.parseUnits(
            String(values.treasuryAndGovernance.reserve),
            usdcDecimals,
         ),
         treasuryNPercent: values.treasuryAndGovernance.npercentage,
         governanceName: values.treasuryAndGovernance.governanceName,
         vaultShareTokenName: values.treasuryAndGovernance.shareTokenName,
         vaultShareTokenSymbol: values.treasuryAndGovernance.shareTokenSymbol,
         vaultFeeReceiver: values.treasuryAndGovernance.feeReceiverAddress,
         vaultFeeToken: values.treasuryAndGovernance.feeToken,
         vaultFeePercentage: values.treasuryAndGovernance.feePercentage,
         aTokenName: values.treasuryAndGovernance.autoCompounderTokenName,
         aTokenSymbol: values.treasuryAndGovernance.autoCompounderTokenSymbol,
         vaultCliff: 30,
         vaultUnlockDuration: 60,
      };

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_BUILDING]);
      const { data: building, error: buildingDeploymentError } = await tryCatch(
         deployBuilding(buildingDetails),
      );
      if (buildingDeploymentError) processError(buildingDeploymentError as any);

      return building;
   };

   const deployBuilding = async (buildingDetails: any) => {
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
