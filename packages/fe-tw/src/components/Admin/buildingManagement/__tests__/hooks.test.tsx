import { renderHook, act } from "@testing-library/react";
import { useBuildingOrchestration } from "../hooks";
import { MajorBuildingStep, BuildingMinorStep } from "../types";
import { INITIAL_VALUES } from "../constants";
import * as helpers from "../helpers";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { ContractId } from "@hashgraph/sdk";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { tryCatch } from "@/services/tryCatch";
import useWriteContract from "@/hooks/useWriteContract";

jest.mock("@/hooks/useUploadImageToIpfs");
jest.mock("@/hooks/useExecuteTransaction");
jest.mock("@buidlerlabs/hashgraph-react-wallets", () => ({
   __esModule: true,
   useWriteContract: jest.fn(),
   useReadContract: jest.fn(),
   useEvmAddress: jest.fn(),
}));

jest.mock("../helpers");
jest.mock("@/services/tryCatch", () => ({
   tryCatch: jest.fn((promise) => promise),
}));

const mockUploadImage = jest.fn();
const mockExecuteTransaction = jest.fn().mockImplementation(async (cb) => {
   const result = await cb();
   return { data: result, error: null };
});
const mockWriteContract = jest.fn();
let mockHelperUploadBuildingInfoToPinata: jest.Mock;

describe("useBuildingOrchestration", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      (useUploadImageToIpfs as jest.Mock).mockReturnValue({ uploadImage: mockUploadImage });
      (useExecuteTransaction as jest.Mock).mockReturnValue({
         executeTransaction: mockExecuteTransaction,
      });
      (useWriteContract as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });

      mockUploadImage.mockResolvedValue("0x_MOCK_IMAGE_IPFS_HASH");
      mockHelperUploadBuildingInfoToPinata = helpers.uploadBuildingInfoToPinata as jest.Mock;
      mockHelperUploadBuildingInfoToPinata.mockResolvedValue("0x_MOCK_METADATA_IPFS_HASH");
      mockWriteContract.mockResolvedValue({
         receipt: "mockReceipt",
         newBuildingAddress: "0x_MOCK_BUILDING_ADDRESS",
      });
      (tryCatch as jest.Mock).mockImplementation(async (promise) => {
         try {
            const data = await promise;
            return { data, error: null };
         } catch (error) {
            return { data: null, error };
         }
      });
   });

   it("should render and return expected structure", () => {
      const { result } = renderHook(() => useBuildingOrchestration());

      expect(result.current).toHaveProperty("currentDeploymentStep");
      expect(result.current).toHaveProperty("submitBuilding");
      expect(result.current.currentDeploymentStep).toEqual([
         MajorBuildingStep.BUILDING,
         BuildingMinorStep.DEPLOY_IMAGE_IPFS,
      ]);
      expect(typeof result.current.submitBuilding).toBe("function");
   });

   it("should call submitBuilding and perform deployment steps", async () => {
      const { result } = renderHook(() => useBuildingOrchestration());

      const minimalValues = {
         info: {
            ...INITIAL_VALUES.info,
            buildingTitle: "Test Building",
            buildingImageIpfsFile: new File([""], "dummy.jpg", { type: "image/jpeg" }),
            buildingTokenSupply: 1000000,
         },
         token: {
            ...INITIAL_VALUES.token,
            tokenName: "TestToken",
            tokenSymbol: "TTK",
            tokenDecimals: 18,
            mintBuildingTokenAmount: 1000,
         },
         treasuryAndGovernance: {
            ...INITIAL_VALUES.treasuryAndGovernance,
            reserve: 10,
            npercentage: 5,
            governanceName: "TestGov",
            shareTokenName: "TestShare",
            shareTokenSymbol: "TSS",
            feeReceiverAddress: "0xFEERECEIVER",
            feeToken: "0xFEETOKEN",
            feePercentage: 1,
            autoCompounderTokenName: "TestAC",
            autoCompounderTokenSymbol: "TAC",
         },
      };

      let submissionResult;
      await act(async () => {
         submissionResult = await result.current.submitBuilding(minimalValues);
      });

      expect(mockUploadImage).toHaveBeenCalledWith(minimalValues.info.buildingImageIpfsFile);
      expect(tryCatch).toHaveBeenCalledWith(
         mockUploadImage(minimalValues.info.buildingImageIpfsFile),
      );

      expect(mockHelperUploadBuildingInfoToPinata).toHaveBeenCalledWith(
         minimalValues,
         "0x_MOCK_IMAGE_IPFS_HASH",
      );
      expect(tryCatch).toHaveBeenCalledWith(
         mockHelperUploadBuildingInfoToPinata(minimalValues, "0x_MOCK_IMAGE_IPFS_HASH"),
      );

      expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);
      const expectedBuildingDetails = {
         tokenURI: "0x_MOCK_METADATA_IPFS_HASH",
         tokenName: minimalValues.token.tokenName,
         tokenSymbol: minimalValues.token.tokenSymbol,
         tokenDecimals: minimalValues.token.tokenDecimals,
         treasuryReserveAmount: minimalValues.treasuryAndGovernance.reserve,
         treasuryNPercent: minimalValues.treasuryAndGovernance.npercentage,
         governanceName: minimalValues.treasuryAndGovernance.governanceName,
         vaultShareTokenName: minimalValues.treasuryAndGovernance.shareTokenName,
         vaultShareTokenSymbol: minimalValues.treasuryAndGovernance.shareTokenSymbol,
         vaultFeeReceiver: minimalValues.treasuryAndGovernance.feeReceiverAddress,
         vaultFeeToken: minimalValues.treasuryAndGovernance.feeToken,
         vaultFeePercentage: minimalValues.treasuryAndGovernance.feePercentage,
         vaultCliff: 30,
         vaultUnlockDuration: 60,
      };

      expect(mockWriteContract).toHaveBeenCalledWith({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newBuilding",
         args: [expectedBuildingDetails],
      });

      expect(submissionResult).toEqual({
         data: { receipt: "mockReceipt", newBuildingAddress: "0x_MOCK_BUILDING_ADDRESS" },
         error: null,
      });
   });
});
