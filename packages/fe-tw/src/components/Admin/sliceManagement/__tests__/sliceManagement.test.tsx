import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SliceManagement } from "@/components/Admin/sliceManagement/index";
import userEvent from "@testing-library/user-event";
import { useCreateSlice } from "@/hooks/useCreateSlice";

jest.mock("@/services/erc20Service", () => ({
    getTokenBalanceOf: () => Promise.resolve([BigInt(10)])
}))
jest.mock("@/hooks/useCreateSlice", () => ({ useCreateSlice: jest.fn() }));
jest.mock("@buidlerlabs/hashgraph-react-wallets", () => ({
    useEvmAddress: jest.fn(() => ({ data: "0xaddr" })),
    useOriginalWriteContract: jest.fn(() => ({
        writeContract: () => Promise.resolve({
            transaction_id: '123456',
        })
    })),
    useWriteContract: jest.fn(() => ({
        writeContract: () => Promise.resolve({
            transaction_id: '123456',
        })
    })),
    useWallet: jest.fn(() => ({
        isConnected: false,
    })), 
    useWatchTransactionReceipt: jest.fn(() => ({
        watch: () => ({
            onSuccess: () => { },
            onError: () => { },
        }),
    })),
}));
jest.mock("@/hooks/useBuildings", jest.fn(() => ({
    useBuildings: jest.fn(() => ({
        buildingsInfo: [{
            buildingAddress: '0xbuild1',
            tokenAddress: '0xtok1',
        }, {
            buildingAddress: '0xbuild2',
            tokenAddress: '0xtok2',
        }],
    }))
})));
const mockSubmitSlice = jest.fn();

describe("SliceManagement", () => {
    describe("Submit slice basic cases", () => {
        beforeEach(() => {
            (useCreateSlice as jest.Mock).mockReturnValue({
                createSlice: mockSubmitSlice,
                waitForLastSliceDeployed: jest.fn(() => Promise.resolve(null)),
                addTokenAssetsToSliceMutation: jest.fn(() => ({
                    mutateAsync: () => Promise.resolve(null),
                })),
                addRewardsIntoSliceMutation: jest.fn(() => ({
                    mutateAsync: () => Promise.resolve(null),
                })),
            });
        });
        
        it("Should submit slice with basic info without allocation", async () => {
            render(<SliceManagement />);
            const user = userEvent.setup();

            await user.type(screen.getByLabelText("Slice Name", { exact: false }), "Name");
            await user.type(screen.getByLabelText("Slice Symbol", { exact: false }), "Symbol");
            await user.type(screen.getByLabelText("Slice Description", { exact: false }), "Description");
            await user.type(screen.getByLabelText("Slice End Date", { exact: false }), "End Date");
            await user.type(screen.getByLabelText("Slice Image IPFS Id", { exact: false }), "image123");
            await user.click(screen.getByRole("button", { name: /Next/i }));
            await user.click(screen.getByRole("button", { name: /Deploy Slice/i }));
            
            await waitFor(() => {
                expect(mockSubmitSlice).toHaveBeenCalledWith(
                    expect.objectContaining({
                        slice: expect.objectContaining({
                            name: "Name",
                            description: "Description",
                            endDate: "",
                            symbol: "Symbol",
                            sliceImageIpfsId: "image123",
                            sliceImageIpfsFile: undefined,
                        }),
                        sliceAllocation: expect.objectContaining({
                            tokenAssets: [],
                            tokenAssetAmounts: {},
                            depositAmount: "0",
                            rewardAmount: "0",
                            allocationAmount: "0",
                        }),
                    }),
                );
            });
        });

        it("Should submit slice with allocation", async () => {
            render(<SliceManagement />);
            const user = userEvent.setup();

            await user.type(screen.getByLabelText("Slice Name", { exact: false }), "Name");
            await user.type(screen.getByLabelText("Slice Symbol", { exact: false }), "Symbol");
            await user.type(screen.getByLabelText("Slice Description", { exact: false }), "Description");
            await user.type(screen.getByLabelText("Slice End Date", { exact: false }), "End Date");
            await user.type(screen.getByLabelText("Slice Image IPFS Id", { exact: false }), "image123");
            await user.click(screen.getByRole("button", { name: /Next/i }));

            await user.type(screen.getByLabelText("Slice Allocation Amount", { exact: false }), "100");
            await user.type(screen.getByLabelText("Slice Deposit Amount", { exact: false }), "100");
            await user.type(screen.getByLabelText("Token Reward Amount in USDC", { exact: false }), "100");
            await user.click(screen.getByTestId('select-token-assets'));
            await user.click(screen.getByRole("button", { name: /Deploy Slice/i }));

            await waitFor(() => {
                expect(mockSubmitSlice).toHaveBeenCalledWith(
                    expect.objectContaining({
                        slice: expect.objectContaining({
                            name: "Name",
                            description: "Description",
                            endDate: "",
                            symbol: "Symbol",
                            sliceImageIpfsId: "image123",
                            sliceImageIpfsFile: undefined,
                        }),
                        sliceAllocation: expect.objectContaining({
                            tokenAssets: [],
                            tokenAssetAmounts: {},
                            depositAmount: "0100",
                            rewardAmount: "0100",
                            allocationAmount: "0100",
                        }),
                    }),
                );
            });
        });
    });
});
