import { renderHook, act } from "@testing-library/react";
import { useBuildingOrchestration } from "../hooks";
import {
   MajorBuildingStep,
   BuildingMinorStep,
   TokenMinorStep,
   TreasuryGovernanceVaultMinorStep,
} from "../types";
import { INITIAL_VALUES } from "../constants"; // Import initial values
import * as helpers from "../helpers"; // Import helpers to mock them
import * as erc20Service from "@/services/erc20Service"; // Import erc20Service to mock
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import {
   useWriteContract,
   useReadContract,
   useEvmAddress,
} from "@buidlerlabs/hashgraph-react-wallets";
import { useATokenDeployFlow } from "@/hooks/vault/useATokenDeployFlow";

// More specific mocks
jest.mock("@/hooks/useBuildingInfo", () => ({
   useBuildingInfo: () => ({
      isLoading: false,
      address: undefined,
      tokenAddress: undefined,
      treasuryAddress: undefined,
      governanceAddress: undefined,
   }),
}));
jest.mock("@/hooks/useUploadImageToIpfs");
jest.mock("@/hooks/useExecuteTransaction");
jest.mock("@buidlerlabs/hashgraph-react-wallets");
jest.mock("@/hooks/vault/useATokenDeployFlow");
jest.mock("@/services/erc20Service");
jest.mock("../helpers");

// Mock implementations
const mockUploadImage = jest.fn();
const mockExecuteTransaction = jest.fn().mockImplementation(async (cb) => {
   await cb();
   return { receipt: "mockReceipt" };
});
const mockWriteContract = jest.fn();
const mockReadContract = jest.fn();
const mockHandleDeployVault = jest.fn();
const mockHandleDeployAutoCompounder = jest.fn();
const mockGetTokenDecimals = jest.fn();
const mockShouldExecuteStep = jest.spyOn(helpers, "shouldExecuteStep").mockReturnValue(true);
const mockUploadBuildingInfoToPinata = jest.spyOn(helpers, "uploadBuildingInfoToPinata");
const mockGetNewBuildingAddress = jest.spyOn(helpers, "getNewBuildingAddress");
const mockWaitForTokenAddress = jest.spyOn(helpers, "waitForTokenAddress");
const mockWaitForTreasuryAddress = jest.spyOn(helpers, "waitForTreasuryAddress");
const mockWaitForGovernanceAddress = jest.spyOn(helpers, "waitForGovernanceAddress");
const mockWaitForAutoCompounderAddress = jest.spyOn(helpers, "waitForAutoCompounderAddress");

describe("useBuildingOrchestration", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      (useUploadImageToIpfs as jest.Mock).mockReturnValue({ uploadImage: mockUploadImage });
      (useExecuteTransaction as jest.Mock).mockReturnValue({
         executeTransaction: mockExecuteTransaction,
      });
      (useWriteContract as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });
      (useReadContract as jest.Mock).mockReturnValue({ readContract: mockReadContract });
      (useEvmAddress as jest.Mock).mockReturnValue({ data: "0x_MOCK_EVM_ADDRESS" });
      (useATokenDeployFlow as jest.Mock).mockReturnValue({
         handleDeployVault: mockHandleDeployVault,
         handleDeployAutoCompounder: mockHandleDeployAutoCompounder,
      });
      (erc20Service.getTokenDecimals as jest.Mock).mockResolvedValue(18);

      mockUploadImage.mockResolvedValue("0x_MOCK_IMAGE_IPFS_HASH");
      mockUploadBuildingInfoToPinata.mockResolvedValue("0x_MOCK_METADATA_IPFS_HASH");
      mockGetNewBuildingAddress.mockResolvedValue("0x_MOCK_BUILDING_ADDRESS");
      mockWaitForTokenAddress.mockResolvedValue("0x_MOCK_TOKEN_ADDRESS");
      mockWaitForTreasuryAddress.mockResolvedValue("0x_MOCK_TREASURY_ADDRESS");
      mockWaitForGovernanceAddress.mockResolvedValue("0x_MOCK_GOVERNANCE_ADDRESS");
      mockReadContract.mockResolvedValue("0x_MOCK_VAULT_ADDRESS");
      mockWaitForAutoCompounderAddress.mockResolvedValue("0x_MOCK_AUTOCOMPOUNDER_ADDRESS");
   });

   it("should render and return expected structure", () => {
      const { result } = renderHook(() => useBuildingOrchestration({ id: undefined }));

      expect(result.current).toHaveProperty("buildingDetails");
      expect(result.current).toHaveProperty("currentDeploymentStep");
      expect(result.current).toHaveProperty("submitBuilding");

      expect(result.current.buildingDetails).toEqual({
         isLoading: false,
         address: undefined,
         tokenAddress: undefined,
         treasuryAddress: undefined,
         governanceAddress: undefined,
      });
      expect(result.current.currentDeploymentStep).toEqual([
         MajorBuildingStep.BUILDING,
         BuildingMinorStep.DEPLOY_IMAGE_IPFS,
      ]);
      expect(typeof result.current.submitBuilding).toBe("function");
   });

   it("should call submitBuilding and call deployment functions one by one", async () => {
      const { result } = renderHook(() => useBuildingOrchestration({ id: undefined }));

      const minimalValues = {
         info: {
            ...INITIAL_VALUES.info,
            buildingTitle: "Test Building",
            buildingImageIpfsFile: new File([""], "dummy.jpg"),
         },
         token: {
            ...INITIAL_VALUES.token,
            tokenName: "TestToken",
            tokenSymbol: "TTK",
            mintBuildingTokenAmount: 1000,
         },
         treasuryAndGovernance: {
            ...INITIAL_VALUES.treasuryAndGovernance,
            reserve: 10,
            npercentage: 5,
            governanceName: "TestGov",
            shareTokenName: "TestShare",
            shareTokenSymbol: "TSS",
            autoCompounderTokenName: "TestAC",
            autoCompounderTokenSymbol: "TAC",
         },
      };

      await act(async () => {
         await result.current.submitBuilding(minimalValues);
      });

      // Step 1: Deploy Image IPFS
      expect(mockUploadImage).toHaveBeenCalledWith(minimalValues.info.buildingImageIpfsFile);

      // Step 2: Deploy COPE (Metadata IPFS)
      expect(mockUploadBuildingInfoToPinata).toHaveBeenCalledWith(
         minimalValues,
         "0x_MOCK_IMAGE_IPFS_HASH",
      );

      // Step 3: Deploy Building
      expect(mockExecuteTransaction).toHaveBeenCalledTimes(5);
      expect(mockWriteContract).toHaveBeenCalledWith(
         expect.objectContaining({
            functionName: "newBuilding",
            args: ["0x_MOCK_METADATA_IPFS_HASH"],
         }),
      );
      expect(mockGetNewBuildingAddress).toHaveBeenCalled();

      // Step 4: Deploy Token
      expect(mockWriteContract).toHaveBeenCalledWith(
         expect.objectContaining({
            functionName: "newERC3643Token",
            args: ["0x_MOCK_BUILDING_ADDRESS", "TestToken", "TTK", 18],
         }),
      );
      expect(mockWaitForTokenAddress).toHaveBeenCalledWith("0x_MOCK_BUILDING_ADDRESS");

      // Step 5: Mint Token
      expect(erc20Service.getTokenDecimals).toHaveBeenCalledWith("0x_MOCK_TOKEN_ADDRESS");
      expect(mockWriteContract).toHaveBeenCalledWith(
         expect.objectContaining({
            functionName: "mint",
            args: ["0x_MOCK_EVM_ADDRESS", BigInt(1000 * 10 ** 18)],
         }),
      );

      // Step 6: Deploy Treasury
      expect(mockWriteContract).toHaveBeenCalledWith(
         expect.objectContaining({
            functionName: "newTreasury",
            args: ["0x_MOCK_BUILDING_ADDRESS", "0x_MOCK_TOKEN_ADDRESS", 10, 5],
         }),
      );
      expect(mockWaitForTreasuryAddress).toHaveBeenCalledWith("0x_MOCK_BUILDING_ADDRESS");

      // Step 7: Deploy Governance
      expect(mockWriteContract).toHaveBeenCalledWith(
         expect.objectContaining({
            functionName: "newGovernance",
            args: [
               "0x_MOCK_BUILDING_ADDRESS",
               "TestGov",
               "0x_MOCK_TOKEN_ADDRESS",
               "0x_MOCK_TREASURY_ADDRESS",
            ],
         }),
      );
      expect(mockWaitForGovernanceAddress).toHaveBeenCalledWith("0x_MOCK_BUILDING_ADDRESS");

      // Step 8: Deploy Vault
      expect(mockHandleDeployVault).toHaveBeenCalledWith(
         expect.objectContaining({
            stakingToken: "0x_MOCK_TOKEN_ADDRESS",
            shareTokenName: "TestShare",
            shareTokenSymbol: "TSS",
         }),
      );
      expect(mockReadContract).toHaveBeenCalledWith(
         expect.objectContaining({ address: "0x_MOCK_TREASURY_ADDRESS", functionName: "vault" }),
      );

      // Step 9: Deploy AutoCompounder (if enabled in minimalValues)
      expect(mockHandleDeployAutoCompounder).toHaveBeenCalledWith(
         expect.objectContaining({
            tokenAsset: "0x_MOCK_VAULT_ADDRESS",
            tokenName: "TestAC",
            tokenSymbol: "TAC",
         }),
      );
      expect(mockWaitForAutoCompounderAddress).toHaveBeenCalledWith("0x_MOCK_VAULT_ADDRESS");
   });
});
