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

export const VALIDATION_SCHEMA = Yup.object({
   info: Yup.object().shape({
      buildingTitle: Yup.string().required("Required"),
      buildingDescription: Yup.string(),
      buildingPurchaseDate: Yup.string(),
      buildingImageIpfsId: Yup.string(),
      buildingImageIpfsFile: Yup.mixed().required("Required"),
      buildingConstructedYear: Yup.string(),
      buildingType: Yup.string(),
      buildingLocation: Yup.string(),
      buildingLocationType: Yup.string(),
      buildingTokenSupply: Yup.number().required("Required"),

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
      tokenName: Yup.string().required("Required"),
      tokenSymbol: Yup.string().required("Required"),
      tokenDecimals: Yup.number().required("Required"),
      buildingTokenAmount: Yup.number().required("Required"),
      tokenBAddress: Yup.string().required("Required"),
      tokenBAmount: Yup.number().required("Required"),
   }),
   treasuryAndGovernance: Yup.object().shape({
      reserve: Yup.number().required("Required"),
      npercentage: Yup.number().required("Required"),
      governanceName: Yup.string().required("Required"),
      shareTokenName: Yup.string().required("Required"),
      shareTokenSymbol: Yup.string().required("Required"),
      feeReceiverAddress: Yup.string().nullable(),
      feePercentage: Yup.number(),
      autoCompounderTokenName: Yup.string(),
      autoCompounderTokenSymbol: Yup.string(),
   }),
});

export const DEPLOYMENT_STEP_TO_FRIENDLY_NAME: Record<string, string> = {
   [MajorBuildingStep.BUILDING]: "Building Info",
   [MajorBuildingStep.TOKEN]: "Token Info",
   [MajorBuildingStep.TREASURY_GOVERNANCE_VAULT]: "Treasury, Governance and Vault",
   [BuildingMinorStep.DEPLOY_IMAGE_IPFS]: "Deploy Image to IPFS...",
   [BuildingMinorStep.DEPLOY_COPE]: "Deploy Building Information to IPFS...",
   [BuildingMinorStep.DEPLOY_BUILDING]: "Deploy Building...",
   [TokenMinorStep.DEPLOY_TOKEN]: "Deploy Token...",
   [TokenMinorStep.DEPLOY_LIQUIDITY]: "Adding Liquidity...",
   [TreasuryGovernanceVaultMinorStep.DEPLOY_TREASURY]: "Deploying Treasury...",
   [TreasuryGovernanceVaultMinorStep.DEPLOY_GOVERNANCE]: "Deploying Governance...",
   [TreasuryGovernanceVaultMinorStep.DEPLOY_VAULT]: "Deploying Vault...",
   [TreasuryGovernanceVaultMinorStep.DEPLOY_AUTO_COMPOUNDER]: "Deploying Auto Compounder...",
};

export const ERROR_TO_DESCRIPTION: Record<Error, string> = {
   [BuildingErrors.UNEXPECTED_ERROR]: "An unexpected error occurred. Please try again.",
   [BuildingFactoryErrors.INVALID_BUILDING_ADDRESS]: "The building address provided is invalid.",
   [BuildingFactoryErrors.TOKEN_ALREADY_CREATED]:
      "A token has already been created for this building.",
   [BuildingFactoryErrors.INVALID_TOKEN_ADDRESS]: "The token address provided is invalid.",
   [BuildingFactoryErrors.INVALID_TREASURY_ADDRESS]: "The treasury address provided is invalid.",
   [BuildingFactoryErrors.NOT_BUILDING_OWNER]: "You are not the owner of this building.",
   [VaultFactoryErrors.VAULT_ALREADY_DEPLOYED]:
      "The vault has already been created for this building.",
   [VaultFactoryErrors.INVALID_STAKING_TOKEN]: "The staking token address provided is invalid.",
   [VaultFactoryErrors.INVALID_REWARD_CONTROLLER_ADDRESS]:
      "The reward controller address provided is invalid.",
   [AutoCompounderErrors.AUTO_COMPOUNDER_ALREADY_DEPLOYED]:
      "The auto compounder has already been created for this building.",
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
};
