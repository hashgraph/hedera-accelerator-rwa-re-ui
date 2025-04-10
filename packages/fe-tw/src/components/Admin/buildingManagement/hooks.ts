import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { useReadContract, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useATokenDeployFlow } from "@/hooks/vault/useATokenDeployFlow";
import { useState } from "react";
import {
   BuildingFormProps,
   BuildingMinorStep,
   MajorBuildingStep,
   MinorBuildingStep,
   TokenFormProps,
   TokenMinorStep,
   TreasuryAndGovernanceFormProps,
   TreasuryGovernanceVaultMinorStep,
   TypedServerError,
   BuildingErrors,
} from "@/components/Admin/buildingManagement/types";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { tryCatch } from "@/services/tryCatch";
import { uploadBuildingInfoToPinata } from "@/components/Admin/buildingManagement/helpers";
import { ContractId } from "@hashgraph/sdk";
import {
   getNewBuildingAddress,
   waitForAutoCompounderAddress,
   waitForGovernanceAddress,
   waitForTokenAddress,
   waitForTreasuryAddress,
} from "./helpers";
import { ethers } from "ethers";
import { isEmpty } from "lodash";

export const useBuildingOrchestration = () => {
   const { addLiquidity } = useBuildingLiquidity();
   const { uploadImage } = useUploadImageToIpfs();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const { handleDeployVault, handleDeployAutoCompounder } = useATokenDeployFlow();

   const [currentDeploymentStep, setCurrentDeploymentStep] = useState<
      [MajorBuildingStep | null, MinorBuildingStep | null]
   >([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);

   const processError = (error: any) => {
      console.error(`Error white deploying building at step ${currentDeploymentStep}`, error);
      const typedError = error.args?.[0]
         ? TypedServerError[error.args?.[0]]
         : BuildingErrors.UNEXPECTED_ERROR;
      throw new Error(typedError);
   };

   const handleSubmitBuilding = async (values: BuildingFormProps) => {
      let result = {};
      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);
      const { data: imageIpfsHash, error: imageIpfsHashError } = await tryCatch(
         uploadImage(values.info.buildingImageIpfsFile),
      );

      if (imageIpfsHashError) {
         processError(imageIpfsHashError);
      }

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_COPE]);
      const { data: buildingMetadataIpfs, error: buildingMetadataIpfsError } = await tryCatch(
         uploadBuildingInfoToPinata(values, imageIpfsHash),
      );

      if (buildingMetadataIpfsError) {
         processError(buildingMetadataIpfsError);
      }

      setCurrentDeploymentStep([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_BUILDING]);
      const { data: buildingAddress, error: deployBuildingError } = await tryCatch(
         deployBuilding(buildingMetadataIpfs),
      );

      if (deployBuildingError) {
         processError(deployBuildingError);
      }

      result = {
         ...result,
         buildingAddress,
      };

      setCurrentDeploymentStep([MajorBuildingStep.TOKEN, TokenMinorStep.DEPLOY_TOKEN]);
      const { data: tokenAddress, error: deployTokenError } = await tryCatch(
         deployToken(buildingAddress, values.token),
      );
      if (deployTokenError) {
         processError(deployTokenError);
      }

      result = {
         ...result,
         tokenAddress,
      };

      setCurrentDeploymentStep([MajorBuildingStep.TOKEN, TokenMinorStep.DEPLOY_LIQUIDITY]);
      const { error: addLiquidityError } = await tryCatch(
         addLiquidity({
            buildingAddress,
            tokenAAddress: tokenAddress,
            tokenAAmount: values.token.buildingTokenAmount,
            tokenBAddress: values.token.tokenBAddress,
            tokenBAmount: values.token.tokenBAmount,
         }),
      );

      if (addLiquidityError) {
         processError(addLiquidityError);
      }

      setCurrentDeploymentStep([
         MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
         TreasuryGovernanceVaultMinorStep.DEPLOY_TREASURY,
      ]);

      const { data: treasuryAddress, error: deployTreasuryError } = await tryCatch(
         deployTreasury(buildingAddress, tokenAddress, values.treasuryAndGovernance),
      );

      if (deployTreasuryError) {
         processError(deployTreasuryError);
      }

      result = {
         ...result,
         treasuryAddress,
      };

      setCurrentDeploymentStep([
         MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
         TreasuryGovernanceVaultMinorStep.DEPLOY_GOVERNANCE,
      ]);
      const { data: governanceAddress, error: deployGovernanceError } = await tryCatch(
         deployGovernance(
            buildingAddress,
            tokenAddress,
            treasuryAddress,
            values.treasuryAndGovernance,
         ),
      );

      if (deployGovernanceError) {
         processError(deployGovernanceError);
      }

      result = {
         ...result,
         governanceAddress,
      };

      setCurrentDeploymentStep([
         MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
         TreasuryGovernanceVaultMinorStep.DEPLOY_VAULT,
      ]);

      const { data: vaultAddress, error: deployVaultError } = await tryCatch(
         deployVault(tokenAddress, treasuryAddress, values.treasuryAndGovernance),
      );

      if (deployVaultError) {
         processError(deployVaultError);
      }

      result = {
         ...result,
         vaultAddress,
      };

      if (
         values.treasuryAndGovernance.autoCompounderTokenName &&
         !values.treasuryAndGovernance.autoCompounderTokenSymbol
      ) {
         setCurrentDeploymentStep([
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_AUTO_COMPOUNDER,
         ]);
         const { data: autoCompounderAddress, error: deployAutoCompounderError } = await tryCatch(
            deployAutoCompounder(vaultAddress, values.treasuryAndGovernance),
         );

         if (deployAutoCompounderError) {
            processError(deployAutoCompounderError);
         }

         result = {
            ...result,
            autoCompounderAddress,
         };
      }

      return result;
   };

   const deployBuilding = async (buildingMetadataIpfs: string) => {
      await executeTransaction(() =>
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "newBuilding",
            metaArgs: { gas: 1_200_000 },
            args: [buildingMetadataIpfs],
         }),
      );
      return getNewBuildingAddress();
   };

   const deployToken = async (buildingAddress: string, token: TokenFormProps) => {
      const [_, address] = await Promise.all([
         executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
               abi: buildingFactoryAbi,
               functionName: "newERC3643Token",
               args: [buildingAddress, token.tokenName, token.tokenSymbol, token.tokenDecimals],
            }),
         ),
         waitForTokenAddress(buildingAddress),
      ]);

      return address;
   };

   const deployTreasury = async (
      buildingAddress: string,
      tokenAddress: string,
      treasuryAndGovernance: TreasuryAndGovernanceFormProps,
   ) => {
      const [_, address] = await Promise.all([
         executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
               abi: buildingFactoryAbi,
               functionName: "newTreasury",
               args: [
                  buildingAddress,
                  tokenAddress,
                  treasuryAndGovernance.reserve,
                  treasuryAndGovernance.npercentage,
               ],
            }),
         ),
         waitForTreasuryAddress(buildingAddress),
      ]);

      return address;
   };

   const deployGovernance = async (
      buildingAddress: string,
      tokenAddress: string,
      treasuryAddress: string,
      treasuryAndGovernance: TreasuryAndGovernanceFormProps,
   ) => {
      const [_, address] = await Promise.all([
         executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
               abi: buildingFactoryAbi,
               functionName: "newGovernance",
               args: [
                  buildingAddress,
                  treasuryAndGovernance.governanceName,
                  tokenAddress,
                  treasuryAddress,
               ],
            }),
         ),
         waitForGovernanceAddress(buildingAddress),
      ]);

      return address;
   };

   const deployVault = async (
      tokenAddress: string,
      treasuryAddress: string,
      treasuryAndGovernance: TreasuryAndGovernanceFormProps,
   ) => {
      await handleDeployVault({
         stakingToken: tokenAddress,
         shareTokenName: treasuryAndGovernance.shareTokenName,
         shareTokenSymbol: treasuryAndGovernance.shareTokenSymbol,
         feeReceiver: isEmpty(treasuryAndGovernance.feeReceiverAddress)
            ? ethers.ZeroAddress
            : treasuryAndGovernance.feeReceiverAddress,
         feeToken: isEmpty(treasuryAndGovernance.feeToken)
            ? ethers.ZeroAddress
            : treasuryAndGovernance.feeToken,
         feePercentage: treasuryAndGovernance.feePercentage || 0,
      });

      return readContract({
         address: treasuryAddress,
         abi: buildingTreasuryAbi,
         functionName: "vault",
      });
   };

   const deployAutoCompounder = async (
      vaultAddress: string,
      treasuryAndGovernance: TreasuryAndGovernanceFormProps,
   ) => {
      const [_, address] = await Promise.all([
         handleDeployAutoCompounder({
            tokenAsset: vaultAddress,
            tokenName: treasuryAndGovernance.autoCompounderTokenName,
            tokenSymbol: treasuryAndGovernance.autoCompounderTokenSymbol,
         }),
         waitForAutoCompounderAddress(vaultAddress),
      ]);

      return address;
   };

   return {
      currentDeploymentStep,
      submitBuilding: handleSubmitBuilding,
   };
};
