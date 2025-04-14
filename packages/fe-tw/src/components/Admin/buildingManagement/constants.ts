import { USDC_ADDRESS } from "@/services/contracts/addresses";
import {
   AutoCompounderErrors,
   BuildingErrors,
   BuildingFactoryErrors,
   BuildingMinorStep,
   CopeFormProps,
   MajorBuildingStep,
   NewBuildingFormProps,
   StepsStatus,
   TokenFormProps,
   TokenMinorStep,
   TreasuryAndGovernanceFormProps,
   TreasuryGovernanceVaultMinorStep,
   VaultFactoryErrors,
   Error,
} from "./types";
import * as Yup from "yup";

export const newBuildingFormInitialValues: NewBuildingFormProps = {
   buildingTitle: "",
   buildingDescription: "",
   buildingPurchaseDate: "",
   buildingImageIpfsId: "",
   buildingImageIpfsFile: undefined,
   buildingConstructedYear: "",
   buildingType: "",
   buildingLocation: "",
   buildingLocationType: "",
   buildingTokenSupply: 1000000,
};

export const newCopeFormInitialValues: CopeFormProps = {
   copeConstructionMaterials: "",
   copeConstructionYearBuilt: "",
   copeConstructionRoofType: "",
   copeConstructionNumFloors: "",
   copeOccupancyType: "",
   copeOccupancyPercentage: "",
   copeProtectionFire: "",
   copeProtectionSprinklers: "",
   copeProtectionSecurity: "",
   copeExposureNearbyRisks: "",
   copeExposureFloodZone: "",
};

export const tokenFormInitialValues: TokenFormProps = {
   tokenName: "",
   tokenSymbol: "",
   tokenDecimals: 18,
   mintBuildingTokenAmount: 0,
   buildingTokenAmount: 0,
   tokenBAddress: USDC_ADDRESS,
   tokenBAmount: 0,
};

export const treasuryAndGovernanceFormInitialValues: TreasuryAndGovernanceFormProps = {
   reserve: undefined,
   npercentage: undefined,
   governanceName: "",
   shareTokenName: "",
   shareTokenSymbol: "",
   feeReceiverAddress: undefined,
   feePercentage: undefined,
   feeToken: USDC_ADDRESS,
   autoCompounderTokenName: "",
   autoCompounderTokenSymbol: "",
};

export const INITIAL_VALUES = {
   info: { ...newBuildingFormInitialValues, ...newCopeFormInitialValues },
   token: tokenFormInitialValues,
   treasuryAndGovernance: treasuryAndGovernanceFormInitialValues,
};

export const VALIDATION_SCHEMA = ({
   buildingDeployed,
   tokensMinted,
   tokenDeployed,
   liquidityAdded,
   treasuryDeployed,
   governanceDeployed,
   vaultDeployed,
}) =>
   Yup.object({
      info: Yup.object().shape({
         buildingTitle: buildingDeployed ? Yup.string() : Yup.string().required("Required"),
         buildingDescription: Yup.string(),
         buildingPurchaseDate: Yup.string(),
         buildingImageIpfsId: Yup.string(),
         buildingImageIpfsFile: buildingDeployed ? Yup.string() : Yup.mixed().required("Required"),
         buildingConstructedYear: Yup.string(),
         buildingType: Yup.string(),
         buildingLocation: Yup.string(),
         buildingLocationType: Yup.string(),
         buildingTokenSupply: buildingDeployed ? Yup.string() : Yup.number().required("Required"),

         copeConstructionMaterials: Yup.string(),
         copeConstructionYearBuilt: Yup.string(),
         copeConstructionRoofType: Yup.string(),
         copeConstructionNumFloors: Yup.string(),
         copeOccupancyType: Yup.string(),
         copeOccupancyPercentage: Yup.string(),
         copeProtectionFire: Yup.string(),
         copeProtectionSprinklers: Yup.string(),
         copeProtectionSecurity: Yup.string(),
         copeExposureNearbyRisks: Yup.string(),
         copeExposureFloodZone: Yup.string(),
      }),
      token: Yup.object().shape({
         tokenName: tokenDeployed ? Yup.string() : Yup.string().required("Required"),
         tokenSymbol: tokenDeployed ? Yup.string() : Yup.string().required("Required"),
         tokenDecimals: tokenDeployed ? Yup.string() : Yup.number().required("Required"),
         mintBuildingTokenAmount: tokensMinted ? Yup.number() : Yup.number().required("Required"),
         buildingTokenAmount: liquidityAdded ? Yup.number() : Yup.number().required("Required"),
         tokenBAddress: liquidityAdded ? Yup.number() : Yup.string().required("Required"),
         tokenBAmount: liquidityAdded ? Yup.number() : Yup.number().required("Required"),
      }),
      treasuryAndGovernance: Yup.object().shape({
         reserve: treasuryDeployed ? Yup.number() : Yup.number().required("Required"),
         npercentage: treasuryDeployed ? Yup.number() : Yup.number().required("Required"),
         governanceName: governanceDeployed ? Yup.string() : Yup.string().required("Required"),
         shareTokenName: vaultDeployed ? Yup.string() : Yup.string().required("Required"),
         shareTokenSymbol: vaultDeployed ? Yup.string() : Yup.string().required("Required"),
         feeReceiverAddress: Yup.string().nullable(),
         feePercentage: Yup.number(),
         autoCompounderTokenName: Yup.string(),
         autoCompounderTokenSymbol: Yup.string(),
      }),
   });

export const MAJOR_STEP_TO_FRIENDLY_NAME: Record<string, string> = {
   [MajorBuildingStep.BUILDING]: "Building Info",
   [MajorBuildingStep.TOKEN]: "Token Info",
   [MajorBuildingStep.TREASURY_GOVERNANCE_VAULT]: "Treasury, Governance and Vault",
};

export const MINOR_STEP_TO_FRIENDLY_NAME = {
   [MajorBuildingStep.BUILDING]: {
      [BuildingMinorStep.DEPLOY_IMAGE_IPFS]: "Deploy Image to IPFS...",
      [BuildingMinorStep.DEPLOY_COPE]: "Deploy Building Information to IPFS...",
      [BuildingMinorStep.DEPLOY_BUILDING]: "Deploy Building...",
   },
   [MajorBuildingStep.TOKEN]: {
      [TokenMinorStep.DEPLOY_TOKEN]: "Deploy Token...",
      [TokenMinorStep.MINT_TOKEN]: "Minting Tokens...",
      [TokenMinorStep.DEPLOY_LIQUIDITY]: "Adding Liquidity...",
   },
   [MajorBuildingStep.TREASURY_GOVERNANCE_VAULT]: {
      [TreasuryGovernanceVaultMinorStep.DEPLOY_TREASURY]: "Deploying Treasury...",
      [TreasuryGovernanceVaultMinorStep.DEPLOY_GOVERNANCE]: "Deploying Governance...",
      [TreasuryGovernanceVaultMinorStep.DEPLOY_VAULT]: "Deploying Vault...",
      [TreasuryGovernanceVaultMinorStep.DEPLOY_AUTO_COMPOUNDER]: "Deploying Auto Compounder...",
   },
};

export const ERROR_TO_DESCRIPTION: Record<Error, string> = {
   [BuildingErrors.UNEXPECTED_ERROR]: "An unexpected error occurred. Please try again.",
   [BuildingFactoryErrors.INVALID_BUILDING_ADDRESS]: "The building address provided is invalid.",
   [BuildingFactoryErrors.TOKEN_ALREADY_CREATED]: "A token has  been created for this building.",
   [BuildingFactoryErrors.INVALID_TOKEN_ADDRESS]: "The token address provided is invalid.",
   [BuildingFactoryErrors.INVALID_TREASURY_ADDRESS]: "The treasury address provided is invalid.",
   [BuildingFactoryErrors.NOT_BUILDING_OWNER]: "You are not the owner of this building.",
   [VaultFactoryErrors.VAULT_ALREADY_DEPLOYED]: "The vault has  been created for this building.",
   [VaultFactoryErrors.INVALID_STAKING_TOKEN]: "The staking token address provided is invalid.",
   [VaultFactoryErrors.INVALID_REWARD_CONTROLLER_ADDRESS]:
      "The reward controller address provided is invalid.",
   [AutoCompounderErrors.AUTO_COMPOUNDER_ALREADY_DEPLOYED]:
      "The auto compounder has  been created for this building.",
   [AutoCompounderErrors.INVALID_UNISWAP_ROUTER_ADDRESS]:
      "The Uniswap router address provided is invalid.",
   [AutoCompounderErrors.INVALID_VAULT_ADDRESS]: "The vault address provided is invalid.",
   [AutoCompounderErrors.INVALID_USDC_ADDRESS]: "USDC address provided is invalid.",
};

export const STEPS = ["info", "token", "treasuryAndGovernance"];
export const FRIENDLY_STEP_NAME = {
   info: "Building Info",
   token: "Token",
   treasuryAndGovernance: "Treasury & Governance",
};

export const FRIENDLY_STEP_STATUS: Record<StepsStatus, string> = {
   [StepsStatus.NOT_STARTED]: "Not Started",
   [StepsStatus.IN_PROGRESS]: "In Progress",
   [StepsStatus.VALID]: "Valid",
   [StepsStatus.INVALID]: "Invalid",
   [StepsStatus.DEPLOYED]: "Deployed",
};
