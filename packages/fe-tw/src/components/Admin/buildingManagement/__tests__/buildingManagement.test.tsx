import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BuildingManagement from "../buildingManagement";
import { MajorBuildingStep, BuildingMinorStep } from "../types";
import userEvent from "@testing-library/user-event";

jest.mock("../hooks", () => ({ useBuildingOrchestration: jest.fn() }));
import { useBuildingOrchestration } from "../hooks";

const mockSubmitBuilding = jest.fn();

describe("BuildingManagement", () => {
   beforeEach(() => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: { isLoading: false },
         currentDeploymentStep: [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS],
         submitBuilding: mockSubmitBuilding,
      });
   });

   it("should fill all steps, validate, and deploy building with correct values", async () => {
      const { container } = render(<BuildingManagement />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText("Building Title", { exact: false }), "My Building");
      await user.type(screen.getByLabelText("Building Image IPFS Id", { exact: false }), "Qm123");
      await user.click(screen.getByRole("button", { name: /Next/i }));
      const step1Title = screen.getByText("Building Info");
      const step1Node = step1Title.closest("[data-state]");
      expect(step1Node).toHaveAttribute("data-state", "valid");

      await user.type(screen.getByLabelText("Token Name", { exact: false }), "MyToken");
      await user.type(screen.getByLabelText("Token Symbol", { exact: false }), "MTK");
      await user.type(screen.getByLabelText("Mint Token Amount", { exact: false }), "1000");
      await user.click(screen.getByRole("button", { name: /Next/i }));
      const step2Title = screen.getByText("Token");
      const step2Node = step2Title.closest("[data-state]");
      expect(step2Node).toHaveAttribute("data-state", "valid");

      await user.type(screen.getByLabelText("Reserve", { exact: false }), "10");
      await user.type(screen.getByLabelText("NPercentage", { exact: false }), "5");
      await user.type(screen.getByLabelText("Governance Name", { exact: false }), "GovName");
      await user.type(screen.getByLabelText("Share Token Name", { exact: false }), "ShareToken");
      await user.type(screen.getByLabelText("Share Token Symbol", { exact: false }), "STK");
      await user.click(screen.getByRole("button", { name: /Deploy Building/i }));

      await waitFor(() => {
         expect(mockSubmitBuilding).toHaveBeenCalledWith(
            expect.objectContaining({
               info: expect.objectContaining({
                  buildingTitle: "My Building",
                  buildingTokenSupply: 1000000,
                  buildingImageIpfsId: "Qm123",
               }),
               token: expect.objectContaining({
                  tokenName: "MyToken",
                  tokenSymbol: "MTK",
                  mintBuildingTokenAmount: 1000,
               }),
               treasuryAndGovernance: expect.objectContaining({
                  reserve: "10",
                  npercentage: "5",
                  governanceName: "GovName",
                  shareTokenName: "ShareToken",
                  shareTokenSymbol: "STK",
               }),
            }),
            null,
         );
      });
   });

   it("should not call submitBuilding and mark first two steps as invalid if skipped and deployed", async () => {
      const { container } = render(<BuildingManagement />);
      const user = userEvent.setup();

      await user.click(screen.getByText("Token"));
      await user.click(screen.getByText("Treasury & Governance"));
      await user.click(screen.getByRole("button", { name: /Deploy Building/i }));

      expect(mockSubmitBuilding).not.toHaveBeenCalled();

      const step1Title = screen.getByText("Building Info");
      const step1Node = step1Title.closest("[data-state]");
      expect(step1Node).toHaveAttribute("data-state", "invalid");

      const step2Title = screen.getByText("Token");
      const step2Node = step2Title.closest("[data-state]");
      expect(step2Node).toHaveAttribute("data-state", "invalid");
   });

   it("should show Building Info as Deployed and go to Token step if only building deployed", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0x0000000000000000000000000000000000000000",
            treasuryAddress: "0x0000000000000000000000000000000000000000",
            governanceAddress: "0x0000000000000000000000000000000000000000",
            vaultAddress: "0x0000000000000000000000000000000000000000",
            tokenAmountMinted: 0,
         },
         currentDeploymentStep: [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS],
         submitBuilding: mockSubmitBuilding,
      });

      const { container } = render(<BuildingManagement id="some-id" />);
      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "in-progress");
   });

   it("should show Building Info and Token as Deployed and disable Token step if building and token are deployed", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            treasuryAddress: "0x0000000000000000000000000000000000000000",
            governanceAddress: "0x0000000000000000000000000000000000000000",
            vaultAddress: "0x0000000000000000000000000000000000000000",
            tokenAmountMinted: 0,
         },
         currentDeploymentStep: [MajorBuildingStep.TOKEN, BuildingMinorStep.DEPLOY_TOKEN],
         submitBuilding: mockSubmitBuilding,
      });

      render(<BuildingManagement id="some-id" />);
      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "in-progress");

      const tokenFieldsContainer = document.querySelector(".opacity-50.pointer-events-none");
      expect(tokenFieldsContainer).toBeInTheDocument();
      expect(tokenFieldsContainer.querySelector("h2").textContent).toBe("Token");
   });

   it("should show steps 1 and 2 as Deployed and go to step 3 if tokens are minted", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            treasuryAddress: "0x0000000000000000000000000000000000000000",
            governanceAddress: "0x0000000000000000000000000000000000000000",
            vaultAddress: "0x0000000000000000000000000000000000000000",
            tokenAmountMinted: 1000,
         },
         currentDeploymentStep: [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS],
         submitBuilding: mockSubmitBuilding,
      });

      render(<BuildingManagement id="some-id" />);

      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "deployed");

      const step3Node = screen.getByTestId("stepper-step-treasuryAndGovernance");
      expect(step3Node).toHaveAttribute("data-state", "in-progress");
   });

   it("should show steps 1, 2 as Deployed and Treasury fields as disabled if treasury is deployed", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            treasuryAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            governanceAddress: "0x0000000000000000000000000000000000000000",
            vaultAddress: "0x0000000000000000000000000000000000000000",
            tokenAmountMinted: 1000,
         },
         currentDeploymentStep: [
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            BuildingMinorStep.DEPLOY_IMAGE_IPFS,
         ],
         submitBuilding: mockSubmitBuilding,
      });

      render(<BuildingManagement id="some-id" />);

      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "deployed");

      const treasuryFieldsContainer = Array.from(
         document.querySelectorAll(".opacity-50.pointer-events-none"),
      ).find((el) => el.querySelector("h2")?.textContent === "Treasury");
      expect(treasuryFieldsContainer).toBeInTheDocument();
   });

   it("should show steps 1, 2 as Deployed and Governance fields as disabled if governance is deployed", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            treasuryAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            governanceAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            vaultAddress: "0x0000000000000000000000000000000000000000",
            tokenAmountMinted: 1000,
         },
         currentDeploymentStep: [
            MajorBuildingStep.TREASURY_GOVERNANCE_VAULT,
            BuildingMinorStep.DEPLOY_IMAGE_IPFS,
         ],
         submitBuilding: mockSubmitBuilding,
      });

      render(<BuildingManagement id="some-id" />);

      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "deployed");

      const governanceFieldsContainer = Array.from(
         document.querySelectorAll(".opacity-50.pointer-events-none"),
      ).find((el) => el.querySelector("h2")?.textContent === "Governance");
      expect(governanceFieldsContainer).toBeInTheDocument();
   });

   it("should show all steps as Deployed and user on first step if all fields in building are deployed", async () => {
      (useBuildingOrchestration as jest.Mock).mockReturnValue({
         buildingDetails: {
            isLoading: false,
            address: "0x1234567890abcdef1234567890abcdef12345678",
            tokenAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            treasuryAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            governanceAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            vaultAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            tokenAmountMinted: 1000,
         },
         currentDeploymentStep: [MajorBuildingStep.BUILDING, BuildingMinorStep.DEPLOY_IMAGE_IPFS],
         submitBuilding: mockSubmitBuilding,
      });

      render(<BuildingManagement id="some-id" />);
      const step1Node = screen.getByTestId("stepper-step-info");
      expect(step1Node).toHaveAttribute("data-state", "deployed");
      const step2Node = screen.getByTestId("stepper-step-token");
      expect(step2Node).toHaveAttribute("data-state", "deployed");
      const step3Node = screen.getByTestId("stepper-step-treasuryAndGovernance");
      expect(step3Node).toHaveAttribute("data-state", "deployed");
   });
});
