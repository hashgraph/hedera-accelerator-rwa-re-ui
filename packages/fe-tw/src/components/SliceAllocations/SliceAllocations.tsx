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

  const handleCancelRebalance = () => {
    closeModal();
  };

  if (isLoading && allocations.length === 0) {
    return <div className="p-6">Loading slice data...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load slice data</div>;
  }

  return (
    <div>
      {/* Rebalance Button */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={openModal}
      >
        Allocation Details
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Confirm Rebalance</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-4">Are you sure you want to rebalance the allocations?</p>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Building</th>
                      <th className="px-4 py-2 border">Current Allocation</th>
                      <th className="px-4 py-2 border">Ideal Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((item) => (
                      <tr key={item.tokenAddress}>
                        <td className="px-4 py-2 border text-center">{item.building.name}</td>
                        <td className="px-4 py-2 border text-center">{item.actualAllocation || "N/A"}</td>
                        <td className="px-4 py-2 border text-center">{item.idealAllocation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelRebalance}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRebalance}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
