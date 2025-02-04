"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";

export const TEST_TOKENS = [
  { value: "0x913007FB64587F5FB31e8f5e4435A1B2DfBE3f6a", label: "BuildingToken" },
  { value: "0xb3C9E22DC608E2f4D75b660aa1009eB79988252b", label: "USDC" },
];

export function AddLiquidityForm() {
  const [formData, setFormData] = useState({
    buildingAddress: "",
    tokenAAddress: "",
    tokenBAddress: "",
    tokenAAmount: "",
    tokenBAmount: "",
  });

  const { isAddingLiquidity, txHash, addLiquidity } = useBuildingLiquidity();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const colourStyles = {
    control: (styles: object) => ({ ...styles, backgroundColor: "#fff" }),
    option: (styles: any) => ({
      ...styles,
      backgroundColor: "#fff",
      color: "#000",
      ":active": {
        ...styles[":active"],
        backgroundColor: "#9333ea36",
      },
      ":focused": {
        backgroundColor: "#9333ea36",
      },
    }),
    placeholder: (styles: object) => ({ ...styles, color: "#9333ea9e" }),
  };

  const handleAddLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.buildingAddress ||
      !formData.tokenAAddress ||
      !formData.tokenBAddress ||
      !formData.tokenAAmount ||
      !formData.tokenBAmount
    ) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress: formData.buildingAddress,
      tokenAAddress: formData.tokenAAddress,
      tokenBAddress: formData.tokenBAddress,
      tokenAAmount: formData.tokenAAmount,
      tokenBAmount: formData.tokenBAmount,
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
            styles={colourStyles}
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
            styles={colourStyles}
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
