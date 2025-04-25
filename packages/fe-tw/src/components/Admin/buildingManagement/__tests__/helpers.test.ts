import {
   transformValuesToContractFormat,
   getNewBuildingAddress,
   waitForTokenAddress,
   shouldExecuteStep,
   getStartFromDeployment,
   waitForTreasuryAddress,
   waitForGovernanceAddress,
   waitForAutoCompounderAddress,
} from "../helpers";
import {
   BuildingFormProps,
   MajorBuildingStep,
   BuildingMinorStep,
   TokenMinorStep,
   TreasuryGovernanceVaultMinorStep,
} from "../types";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { readBuildingsList } from "@/services/buildingService";
import { INITIAL_VALUES } from "../constants";
import {
   BUILDING_FACTORY_ADDRESS,
   AUTO_COMPOUNDER_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { waitFor } from "@testing-library/react";

jest.mock("@/utils/pinata");
jest.mock("@/services/contracts/watchContractEvent");
jest.mock("@/services/buildingService");
const mockWatchContractEvent = watchContractEvent as jest.Mock;
const mockReadBuildingsList = readBuildingsList as jest.Mock;

describe("helpers", () => {
   const mockValues: BuildingFormProps = {
      ...INITIAL_VALUES,
      info: {
         ...INITIAL_VALUES.info,
         buildingTitle: "Test Building",
         buildingDescription: "Test Description",
         buildingPurchaseDate: "2024-01-01",
         buildingConstructedYear: "2000",
         buildingType: "Residential",
         buildingLocation: "Test Location",
         buildingLocationType: "Urban",
         buildingTokenSupply: 1000000,
         copeConstructionMaterials: "Brick",
         copeConstructionYearBuilt: "2000",
         copeConstructionRoofType: "Tile",
         copeConstructionNumFloors: "2",
         copeOccupancyType: "Owner",
         copeOccupancyPercentage: "100",
         copeProtectionFire: "Yes",
         copeProtectionSprinklers: "Yes",
         copeProtectionSecurity: "Yes",
         copeExposureNearbyRisks: "None",
         copeExposureFloodZone: "No",
      },
   };
   const mockImageIpfsHash = "mockImageHash";

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("transformValuesToContractFormat", () => {
      it("should transform form values to the expected contract format", () => {
         const expectedFormat = {
            name: "Test Building",
            description: "Test Description",
            image: mockImageIpfsHash,
            purchasedAt: "2024-01-01",
            attributes: [
               { trait_type: "constructedYear", value: "2000" },
               { trait_type: "type", value: "Residential" },
               { trait_type: "location", value: "Test Location" },
               { trait_type: "locationType", value: "Urban" },
               { trait_type: "tokenSupply", value: "1000000" },
            ],
            cope: {
               construction: {
                  materials: "Brick",
                  yearBuilt: "2000",
                  roofType: "Tile",
                  numFloors: "2",
               },
               occupancy: {
                  type: "Owner",
                  percentageOccupied: "100",
               },
               protection: {
                  fire: "Yes",
                  sprinklers: "Yes",
                  security: "Yes",
               },
               exposure: {
                  nearbyRisks: "None",
                  floodZone: "No",
               },
            },
         };
         const result = transformValuesToContractFormat(mockValues, mockImageIpfsHash);
         expect(result).toEqual(expectedFormat);
      });
   });

   describe("getNewBuildingAddress", () => {
      it("should return the address of the last building from the list", async () => {
         const mockBuildings = [
            ["0xBuilding1", "ipfs1"],
            ["0xBuilding2", "ipfs2"],
         ];
         mockReadBuildingsList.mockResolvedValueOnce([mockBuildings]);
         const result = await getNewBuildingAddress();
         expect(mockReadBuildingsList).toHaveBeenCalledTimes(1);
         expect(result).toBe("0xBuilding2");
      });

      it("should throw an error if no buildings are found", async () => {
         mockReadBuildingsList.mockResolvedValueOnce([]);
         await expect(getNewBuildingAddress()).rejects.toThrow("No building found");
      });
   });

   describe("shouldExecuteStep", () => {
      const step1: [MajorBuildingStep, BuildingMinorStep] = [
         MajorBuildingStep.BUILDING,
         BuildingMinorStep.DEPLOY_IMAGE_IPFS,
      ];
      const step2: [MajorBuildingStep, BuildingMinorStep] = [
         MajorBuildingStep.BUILDING,
         BuildingMinorStep.DEPLOY_COPE,
      ];
      const step3: [MajorBuildingStep, TokenMinorStep] = [
         MajorBuildingStep.TOKEN,
         TokenMinorStep.DEPLOY_TOKEN,
      ];

      it("should return true if startFromStep is undefined", () => {
         expect(shouldExecuteStep(step1)).toBe(true);
         expect(shouldExecuteStep(step2)).toBe(true);
      });

      it("should return true if current step value is equal to startFromStep value", () => {
         expect(shouldExecuteStep(step2, step2)).toBe(true);
      });

      it("should return true if current step value is greater than startFromStep value", () => {
         expect(shouldExecuteStep(step2, step1)).toBe(true);
         expect(shouldExecuteStep(step3, step2)).toBe(true);
      });

      it("should return false if current step value is less than startFromStep value", () => {
         expect(shouldExecuteStep(step1, step2)).toBe(false);
         expect(shouldExecuteStep(step2, step3)).toBe(false);
      });
   });

   describe("getStartFromDeployment", () => {
      const allFalse = {
         buildingDeployed: false,
         tokenDeployed: false,
         tokensMinted: false,
         treasuryDeployed: false,
         governanceDeployed: false,
         vaultDeployed: false,
      };
      const buildingDone = { ...allFalse, buildingDeployed: true };
      const tokenDeployDone = { ...buildingDone, tokenDeployed: true };
      const tokenMintDone = { ...tokenDeployDone, tokensMinted: true };
      const treasuryDone = { ...tokenMintDone, treasuryDeployed: true };
      const governanceDone = { ...treasuryDone, governanceDeployed: true };
      const vaultDone = { ...governanceDone, vaultDeployed: true };

      it("should return null if building is not deployed", () => {
         expect(getStartFromDeployment(allFalse)).toBeNull();
      });

      it("should return DEPLOY_TOKEN if building is deployed but token is not", () => {
         expect(getStartFromDeployment(buildingDone)).toEqual([
            MajorBuildingStep.TOKEN,
            TokenMinorStep.DEPLOY_TOKEN,
         ]);
      });

      it("should return MINT_TOKEN if token is deployed but not minted", () => {
         expect(getStartFromDeployment(tokenDeployDone)).toEqual([
            MajorBuildingStep.TOKEN,
            TokenMinorStep.MINT_TOKEN,
         ]);
      });

      it("should return DEPLOY_TREASURY if token is minted but treasury is not deployed", () => {
         expect(getStartFromDeployment(tokenMintDone)).toEqual([
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_TREASURY,
         ]);
      });

      it("should return DEPLOY_GOVERNANCE if treasury is deployed but governance is not", () => {
         expect(getStartFromDeployment(treasuryDone)).toEqual([
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_GOVERNANCE,
         ]);
      });

      it("should return DEPLOY_VAULT if governance is deployed but vault is not", () => {
         expect(getStartFromDeployment(governanceDone)).toEqual([
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_VAULT,
         ]);
      });

      it("should return DEPLOY_AUTO_COMPOUNDER if vault is deployed", () => {
         expect(getStartFromDeployment(vaultDone)).toEqual([
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            TreasuryGovernanceVaultMinorStep.DEPLOY_AUTO_COMPOUNDER,
         ]);
      });
   });
});

describe("waitForTokenAddress", () => {
   const mockBuildingAddress = "0xBuilding123";
   const expectedTokenAddress = "0xTokenABC";
   const mockUnsubscribe = jest.fn();
   let onLogsCallback: (data: any[]) => void = () => {};

   beforeEach(() => {
      jest.clearAllMocks();
      onLogsCallback = () => {};
      mockWatchContractEvent.mockImplementation(({ onLogs }) => {
         onLogsCallback = onLogs;
         return mockUnsubscribe;
      });
   });

   it("should resolve with the token address when the correct NewERC3643Token event is emitted", async () => {
      const resultTokenAddressPromise = waitForTokenAddress(mockBuildingAddress);

      const nonMatchingLog = { args: ["0xOtherToken", "0xOtherBuilding"] };
      onLogsCallback([nonMatchingLog]);

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      const matchingLog = { args: [expectedTokenAddress, mockBuildingAddress] };
      onLogsCallback([nonMatchingLog, matchingLog]);

      const resolvedTokenAddress = await resultTokenAddressPromise;

      expect(resolvedTokenAddress).toBe(expectedTokenAddress);
      expect(mockWatchContractEvent).toHaveBeenCalledWith({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewERC3643Token",
         onLogs: expect.any(Function),
      });
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
   });
});

describe("waitForTreasuryAddress", () => {
   const mockBuildingAddress = "0xBuilding456";
   const expectedTreasuryAddress = "0xTreasuryDEF";
   const mockUnsubscribe = jest.fn();
   let onLogsCallback: (data: any[]) => void = () => {};

   beforeEach(() => {
      jest.clearAllMocks();
      onLogsCallback = () => {};
      mockWatchContractEvent.mockImplementation(({ onLogs }) => {
         onLogsCallback = onLogs;
         return mockUnsubscribe;
      });
   });

   it("should resolve with the treasury address when the correct NewTreasury event is emitted", async () => {
      const promise = waitForTreasuryAddress(mockBuildingAddress);

      const nonMatchingLog = { args: ["0xOtherTreasury", "0xOtherBuilding"] };
      onLogsCallback([nonMatchingLog]);

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      const matchingLog = { args: [expectedTreasuryAddress, mockBuildingAddress] };
      onLogsCallback([nonMatchingLog, matchingLog]);

      const resolvedTreasuryAddress = await promise;

      expect(resolvedTreasuryAddress).toBe(expectedTreasuryAddress);
      expect(mockWatchContractEvent).toHaveBeenCalledWith({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewTreasury",
         onLogs: expect.any(Function),
      });
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
   });
});

describe("waitForGovernanceAddress", () => {
   const mockBuildingAddress = "0xBuilding789";
   const expectedGovernanceAddress = "0xGovernanceGHI";
   const mockUnsubscribe = jest.fn();
   let onLogsCallback: (data: any[]) => void = () => {};

   beforeEach(() => {
      jest.clearAllMocks();
      onLogsCallback = () => {};
      mockWatchContractEvent.mockImplementation(({ onLogs }) => {
         onLogsCallback = onLogs;
         return mockUnsubscribe;
      });
   });

   it("should resolve with the governance address when the correct NewGovernance event is emitted", async () => {
      const promise = waitForGovernanceAddress(mockBuildingAddress);

      const matchingLog = { args: [expectedGovernanceAddress, mockBuildingAddress] };
      onLogsCallback([matchingLog]);

      const resolvedGovernanceAddress = await promise;

      expect(resolvedGovernanceAddress).toBe(expectedGovernanceAddress);
      expect(mockWatchContractEvent).toHaveBeenCalledWith({
         address: BUILDING_FACTORY_ADDRESS,
         abi: buildingFactoryAbi,
         eventName: "NewGovernance",
         onLogs: expect.any(Function),
      });
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
   });
});

describe("waitForAutoCompounderAddress", () => {
   const mockVaultAddress = "0xVaultJKL";
   const expectedAutoCompounderAddress = "0xAutoCompounderMNO";
   const mockUnsubscribe = jest.fn();
   let onLogsCallback: (data: any[]) => void = () => {};

   beforeEach(() => {
      jest.clearAllMocks();
      onLogsCallback = () => {};
      mockWatchContractEvent.mockImplementation(({ onLogs }) => {
         onLogsCallback = onLogs;
         return mockUnsubscribe;
      });
   });

   it("should resolve with the auto compounder address when the correct AutoCompounderDeployed event is emitted", async () => {
      const promise = waitForAutoCompounderAddress(mockVaultAddress);

      const matchingLog = { args: [expectedAutoCompounderAddress, mockVaultAddress] };
      onLogsCallback([matchingLog]);

      const resolvedAutoCompounderAddress = await promise;

      expect(resolvedAutoCompounderAddress).toBe(expectedAutoCompounderAddress);
      expect(mockWatchContractEvent).toHaveBeenCalledWith({
         address: AUTO_COMPOUNDER_FACTORY_ADDRESS,
         abi: autoCompounderFactoryAbi,
         eventName: "AutoCompounderDeployed",
         onLogs: expect.any(Function),
      });
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
   });
});
