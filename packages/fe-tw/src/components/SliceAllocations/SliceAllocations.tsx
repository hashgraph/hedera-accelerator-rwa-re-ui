"use client";

import { useState } from "react";
import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";

type TokenWithBuilding = {
  tokenAddress: string;
  building: {
    nftId: number;
    name: string;
    image: string;
    location: string;
  };
  idealAllocation: string;
  actualAllocation: string;
};

type SliceAllocationsProps = {
  sliceName: string;
  tokensWithBuilding: TokenWithBuilding[];
};

export default function SliceAllocations({ sliceName, tokensWithBuilding }: SliceAllocationsProps) {
  const [allocations, setAllocations] = useState(tokensWithBuilding);
  const { rebalance } = useRebalanceSlice(sliceName);

  async function handleRebalanceClick() {
    await rebalance();

    // set actualAllocation = idealAllocation for all tokens
    const rebalanced = allocations.map((item) => ({
      ...item,
      actualAllocation: item.idealAllocation,
    }));

    setAllocations(rebalanced);
  }

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleRebalanceClick}
      >
        Rebalance
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allocations.map((item) => (
          <div key={item.tokenAddress} className="border p-4 rounded">
            <img
              src={item.building.image}
              alt={item.building.name}
              className="mb-2 w-full h-32 object-cover rounded"
            />
            <p className="font-bold text-lg">{item.building.name}</p>
            <p className="text-sm text-gray-600">NFT ID: {item.building.nftId}</p>
            <p className="text-sm text-gray-600">Location: {item.building.location}</p>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">Ideal Allocation:</span> {item.idealAllocation}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Actual Allocation:</span> {item.actualAllocation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
