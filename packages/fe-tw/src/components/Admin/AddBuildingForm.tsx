"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { MetamaskConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { ethers } from "ethers";

import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";

export function AddBuildingForm() {
  const { isConnected, signer } = useWallet(MetamaskConnector);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    tokenSupply: 1000000,
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (!isConnected || !signer) {
        toast.error("No wallet connected. Please connect MetaMask first.");
        return;
      }

      const typedSigner = signer as unknown as ethers.Signer;
      const tokenURI = "ipfs://bafkreifuy6zkjpyqu5ygirxhejoryt6i4orzjynn6fawbzsuzofpdgqscq";

      const factoryContract = new ethers.Contract(
        BUILDING_FACTORY_ADDRESS,
        buildingFactoryAbi,
        typedSigner
      );

      const tx = await factoryContract.newBuilding(tokenURI);
      const receipt = await tx.wait();

      if (receipt.transactionHash) {
        toast.success("Building added successfully!");
        setFormData({ name: "", location: "", tokenSupply: 1000000 });
      } else {
        toast.error("Transaction failed or canceled.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add building");
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Building</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* not used for tokenURI in the code right now - will be call to IPFS */}
        <div>
          <label className="block text-sm font-semibold">Building Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter building name"
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
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Add Building
        </button>
      </form>
    </div>
  );
}
