"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import type { WalletInterface } from "@/services/wallets/WalletInterface";
import { useWalletInterface } from "@/services/useWalletInterface";
import { ContractId } from "@hashgraph/sdk";

import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";

interface AddBuildingFormProps {}

export function AddBuildingForm(props: AddBuildingFormProps) {
  const { walletInterface } = useWalletInterface(); 
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    tokenSupply: 1000000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!walletInterface) {
        toast.error("No wallet connected. Please connect first.");
        return;
      }

      const { name, location, tokenSupply } = formData;
      const supplyBigInt = BigInt(tokenSupply);
      const args = [name, location, supplyBigInt];

      const txHashOrId = await walletInterface.executeContractFunction(
        ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
        buildingFactoryAbi,
        "newBuilding",
        args
      );

      if (txHashOrId) {
        toast.success("Building added successfully!");
        setFormData({ name: "", location: "", tokenSupply: 1000000 });
      } else {
        toast.error("Transaction failed or canceled.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add building");
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Building</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Building Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter building name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Token Supply</label>
          <input
            type="number"
            name="tokenSupply"
            value={formData.tokenSupply}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter token supply"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Add Building
        </button>
      </form>
    </div>
  );
}
