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
import {
   shouldExecuteStep,
   uploadBuildingInfoToPinata,
} from "@/components/Admin/buildingManagement/helpers";
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
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { getTokenDecimals } from "@/services/erc20Service";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";

export const useBuildingOrchestration = ({ id }: { id?: string }) => {
   const { uploadImage } = useUploadImageToIpfs();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const { handleDeployVault, handleDeployAutoCompounder } = useATokenDeployFlow();
   const { data: evmAddress } = useEvmAddress();

   const buildingDetails = useBuildingInfo(id);

   const [currentDeploymentStep, setCurrentDeploymentStep] = useState<
      [MajorBuildingStep | null, MinorBuildingStep | null]
   >([MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS]);

   const processError = (error: any) => {
      const typedError = error.args?.[0]
         ? TypedServerError[error.args?.[0]]
         : BuildingErrors.UNEXPECTED_ERROR;
      throw new Error(typedError);
   };

   const handleSubmitBuilding = async (
      values: BuildingFormProps,
      startFrom?: [MajorBuildingStep, MinorBuildingStep],
   ) => {
      let result = {
         buildingAddress: buildingDetails?.address,
         tokenAddress: buildingDetails?.tokenAddress,
         treasuryAddress: buildingDetails?.treasuryAddress,
         governanceAddress: buildingDetails?.governanceAddress,
         vaultAddress: undefined,
      };

      const executeStepIfNeeded = async <T>(
         step: [MajorBuildingStep, MinorBuildingStep],
         action: () => Promise<T>,
      ): Promise<T> => {
         if (!shouldExecuteStep(step, startFrom)) {
            return null as T;
         }

         setCurrentDeploymentStep(step);
         const { data, error } = await tryCatch(action());

         if (error) {
            processError(error);
         }

         return data;
      };

      /* const imageIpfsHash = await executeStepIfNeeded(
         [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS],
         () => uploadImage(values.info.buildingImageIpfsFile),
      ); */

      const buildingMetadataIpfs = await executeStepIfNeeded(
         [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_COPE],
         () => uploadBuildingInfoToPinata(values, values.info.buildingImageIpfsId),
      );

      const buildingAddress = await executeStepIfNeeded(
         [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_BUILDING],
         () => deployBuilding(buildingMetadataIpfs),
      );

      if (buildingAddress) result.buildingAddress = buildingAddress;

      const tokenAddress = await executeStepIfNeeded(
         [MajorBuildingStep.TOKEN, TokenMinorStep.DEPLOY_TOKEN],
         () => deployToken(result.buildingAddress, values.token),
      );

      if (tokenAddress) result.tokenAddress = tokenAddress;

      await executeStepIfNeeded([MajorBuildingStep.TOKEN, TokenMinorStep.MINT_TOKEN], () =>
         mintToken(result.tokenAddress, values.token.mintBuildingTokenAmount),
      );

      const treasuryAddress = await executeStepIfNeeded(
         [
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_TREASURY,
         ],
         () =>
            deployTreasury(
               result.buildingAddress,
               result.tokenAddress,
               values.treasuryAndGovernance,
            ),
      );

      if (treasuryAddress) result.treasuryAddress = treasuryAddress;

      const governanceAddress = await executeStepIfNeeded(
         [
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_GOVERNANCE,
         ],
         () =>
            deployGovernance(
               result.buildingAddress,
               result.tokenAddress,
               result.treasuryAddress,
               values.treasuryAndGovernance,
            ),
      );

      if (governanceAddress) result.governanceAddress = governanceAddress;

      const vaultAddress = await executeStepIfNeeded(
         [
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_VAULT,
         ],
         () =>
            deployVault(result.tokenAddress, result.treasuryAddress, values.treasuryAndGovernance),
      );

      if (vaultAddress) result.vaultAddress = vaultAddress;

      if (Boolean(values.treasuryAndGovernance.autoCompounderTokenName)) {
         const autoCompounderAddress = await executeStepIfNeeded(
            [
               MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
               TreasuryGovernanceVaultMinorStep.DEPLOY_AUTO_COMPOUNDER,
            ],
            () => deployAutoCompounder(vaultAddress, values.treasuryAndGovernance),
         );

         if (autoCompounderAddress) result.autoCompounderAddress = autoCompounderAddress;
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

   const mintToken = async (tokenAddress: string, amount: string) => {
      const decimals = await getTokenDecimals(tokenAddress);

      return executeTransaction(() =>
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, tokenAddress),
            abi: tokenAbi,
            functionName: "mint",
            args: [evmAddress, BigInt(Math.floor(Number.parseFloat(amount) * 10 ** decimals))],
         }),
      );
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
      buildingDetails,
      currentDeploymentStep,
      submitBuilding: handleSubmitBuilding,
   };
};
