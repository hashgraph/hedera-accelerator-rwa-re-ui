"use client";

import { useState } from "react";
import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";
import RebalanceModal from "@/components/RebalanceModal/RebalanceModal";

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
  const [allocations, setAllocations] = useState<TokenWithBuilding[]>(tokensWithBuilding);
  const { data, isLoading, isError, rebalance } = useRebalanceSlice(sliceName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmRebalance = async () => {
    try {
      await rebalance();

      // mock, needs to be replaced
      const rebalanced = allocations.map((item) => ({
        ...item,
        actualAllocation: item.idealAllocation,
      }));

      setAllocations(rebalanced);
      closeModal();
    } catch (error) {
      console.error("Rebalance failed:", error);
      closeModal();
    }
  };

  if (isLoading && allocations.length === 0) {
    return <div className="p-6">Loading slice data...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load slice data</div>;
  }

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={openModal}
      >
        View Allocations
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allocations.map((item) => (
          <div key={item.tokenAddress} className="border p-4 rounded hover:bg-gray-100 transition duration-200">
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

      <RebalanceModal
        isOpen={isModalOpen}
        allocations={allocations}
        onClose={closeModal}
        onConfirm={handleConfirmRebalance}
        onCancel={closeModal}
      />
    </div>
  );
}
