"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";

export const TEST_TOKENS = [
  { value: "0x1234ABCD...", label: "BUILDING_TOKEN" },
  { value: "0x5678EFGH...", label: "TEST_USDC" },
];

export function AddBuildingTokenLiquidityForm() {
  const { isAddingLiquidity, txHash, addLiquidity } = useBuildingLiquidity();

  const [formData, setFormData] = useState({
    buildingAddress: "",
    tokenAAddress: "",
    tokenBAddress: "",
    tokenAAmount: "100",
    tokenBAmount: "1",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();

    const { buildingAddress, tokenAAddress, tokenBAddress, tokenAAmount, tokenBAmount } = formData;
    if (!buildingAddress || !tokenAAddress || !tokenBAddress || !tokenAAmount || !tokenBAmount) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    });

    setFormData({
      buildingAddress: "",
      tokenAAddress: "",
      tokenBAddress: "",
      tokenAAmount: "100",
      tokenBAmount: "1",
    });
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Liquidity</h3>
      <form onSubmit={handleAddLiquidity} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Building Address</label>
          <input
            type="text"
            name="buildingAddress"
            value={formData.buildingAddress}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="0xBuilding..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Select Token A</label>
          <Select
            placeholder="Pick Token A"
            onChange={(option) => {
              setFormData((prev) => ({
                ...prev,
                tokenAAddress: option?.value || "",
              }));
            }}
            options={TEST_TOKENS}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Token A Amount</label>
          <input
            type="text"
            name="tokenAAmount"
            value={formData.tokenAAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g. 100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Select Token B</label>
          <Select
            placeholder="Pick Token B"
            onChange={(option) => {
              setFormData((prev) => ({
                ...prev,
                tokenBAddress: option?.value || "",
              }));
            }}
            options={TEST_TOKENS}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Token B Amount</label>
          <input
            type="text"
            name="tokenBAmount"
            value={formData.tokenBAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g. 1"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isAddingLiquidity}
        >
          {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 text-sm text-gray-700">
          Liquidity Tx Hash: <span className="font-bold">{txHash}</span>
        </div>
      )}
    </div>
  );
}
