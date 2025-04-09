export interface NewBuildingFormProps {
   buildingTitle: string;
   buildingDescription?: string;
   buildingPurchaseDate?: string;
   buildingImageIpfsId: string;
   buildingImageIpfsFile?: File;
   buildingConstructedYear?: string;
   buildingType?: string;
   buildingLocation?: string;
   buildingLocationType?: string;
   buildingTokenSupply: number;
}

export interface CopeFormProps {
   copeConstructionMaterials: string;
   copeConstructionYearBuilt: string;
   copeConstructionRoofType: string;
   copeConstructionNumFloors: string;
   copeOccupancyType: string;
   copeOccupancyPercentage: string;
   copeProtectionFire: string;
   copeProtectionSprinklers: string;
   copeProtectionSecurity: string;
   copeExposureNearbyRisks: string;
   copeExposureFloodZone: string;
}

export interface TokenFormProps {
   tokenName: string;
   tokenSymbol: string;
   tokenDecimals: number;
   buildingTokenAmount: number;
   tokenBAddress: string;
   tokenBAmount: number;
}

export interface TreasuryAndGovernanceFormProps {
   reserve: number;
   npercentage: number;
   governanceName: string;
   shareTokenName: string;
   shareTokenSymbol: string;
   feeReceiverAddress: string;
   feeToken: string;
   feePercentage: number;
   autoCompounderTokenName: string;
   autoCompounderTokenSymbol: string;
}

export interface BuildingFormProps {
   info: NewBuildingFormProps & CopeFormProps;
   token: TokenFormProps;
   treasuryAndGovernance: TreasuryAndGovernanceFormProps;
}

export enum MajorBuildingStep {
   BUILDING = "BUILDING",
   TOKEN = "TOKEN",
   TREASURY_GOVERNANCE_VAULT = "TREASURY_GOVERNANCE_VAULT",
}

export enum BuildingMinorStep {
   DEPLOY_IMAGE_IPFS = "DEPLOY_IMAGE_IPFS",
   DEPLOY_COPE = "DEPLOY_COPE",
   DEPLOY_BUILDING = "DEPLOY_BUILDING",
}

export enum TokenMinorStep {
   DEPLOY_TOKEN = "DEPLOY_TOKEN",
   DEPLOY_LIQUIDITY = "DEPLOY_LIQUIDITY",
}

export enum TreasuryGovernanceVaultMinorStep {
   DEPLOY_TREASURY = "DEPLOY_TREASURY",
   DEPLOY_GOVERNANCE = "DEPLOY_GOVERNANCE",
   DEPLOY_VAULT = "DEPLOY_VAULT",
   DEPLOY_AUTO_COMPOUNDER = "DEPLOY_AUTO_COMPOUNDER",
}

export type MinorBuildingStep =
   | BuildingMinorStep
   | TokenMinorStep
   | TreasuryGovernanceVaultMinorStep;

export enum StepsStatus {
   NOT_STARTED = "not-started",
   IN_PROGRESS = "in-progress",
   VALID = "valid",
   INVALID = "invalid",
}

export enum BuildingErrors {
   UNEXPECTED_ERROR = "Unexpected error",
}

export enum BuildingFactoryErrors {
   INVALID_BUILDING_ADDRESS = "Invalid building address",
   TOKEN_ALREADY_CREATED = "Token already created",
   INVALID_TOKEN_ADDRESS = "Invalid token address",
   INVALID_TREASURY_ADDRESS = "Invalid treasury address",
   NOT_BUILDING_OWNER = "Not building owner",
}

export enum VaultFactoryErrors {
   VAULT_ALREADY_DEPLOYED = "Vault already deployed",
   INVALID_STAKING_TOKEN = "Invalid staking token",
   INVALID_REWARD_CONTROLLER_ADDRESS = "Invalid reward controller address",
}

export enum AutoCompounderErrors {
   AUTO_COMPOUNDER_ALREADY_DEPLOYED = "AutoCompounder already deployed",
   INVALID_UNISWAP_ROUTER_ADDRESS = "Invalid Uniswap router address",
   INVALID_VAULT_ADDRESS = "Invalid vault address",
   INVALID_USDC_ADDRESS = "Invalid USDC address",
}

export type Error =
   | BuildingErrors
   | BuildingFactoryErrors
   | VaultFactoryErrors
   | AutoCompounderErrors;

export const TypedServerError: Record<string, Error> = {
   "BuildingFactory: Invalid building address": BuildingFactoryErrors.INVALID_BUILDING_ADDRESS,
   "BuildingFactory: token already created for building":
      BuildingFactoryErrors.TOKEN_ALREADY_CREATED,
   "BuildingFactory: Invalid token address": BuildingFactoryErrors.INVALID_TOKEN_ADDRESS,
   "BuildingFactory: Invalid treasury address": BuildingFactoryErrors.INVALID_TREASURY_ADDRESS,
   "BuildingFactory: Not building owner": BuildingFactoryErrors.NOT_BUILDING_OWNER,
   "VaultFactory: Vault already deployed": VaultFactoryErrors.VAULT_ALREADY_DEPLOYED,
   "VaultFactory: Invalid staking token": VaultFactoryErrors.INVALID_STAKING_TOKEN,
   "VaultFactory: Invalid reward controller address":
      VaultFactoryErrors.INVALID_REWARD_CONTROLLER_ADDRESS,
   "AutoCompounderFactory: AutoCompounder already deployed":
      AutoCompounderErrors.AUTO_COMPOUNDER_ALREADY_DEPLOYED,
   "AutoCompounderFactory: Invalid Uniswap Router address":
      AutoCompounderErrors.INVALID_UNISWAP_ROUTER_ADDRESS,
   "AutoCompounderFactory: Invalid Vault address": AutoCompounderErrors.INVALID_VAULT_ADDRESS,
   "AutoCompounderFactory: Invalid USDC address": AutoCompounderErrors.INVALID_USDC_ADDRESS,
};
