"use client";
import { useState } from "react";
import RebalanceModal from "@/components/Slices/RebalanceModal";
import Link from "next/link";

type TokenWithBuilding = {
  tokenAddress: string;
  building: {
    nftId?: number | null;
    name?: string;
    image?: string;
    location?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // mock for demo: set actualAllocation to idealAllocation in the FE
  const handleConfirmRebalance = () => {
    setAllocations((prev) =>
      prev.map((allocation) => ({
        ...allocation,
        actualAllocation: allocation.idealAllocation,
      }))
    );
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Token Allocations
      </h2>
      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-900 transition"
          onClick={openModal}
        >
          Show all Allocations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allocations.map((item) => (
          <Link key={item.tokenAddress} href={`/building/${item.building.nftId ?? ""}`}>
            <div
              className="p-4 rounded-lg bg-[#F9F3F8] hover:bg-[#EADFEA] transition duration-200 cursor-pointer"
            >
              <img
                src={item.building.image}
                alt={item.building.name ?? "Unnamed Building"}
                className="mb-2 w-full h-32 object-cover rounded"
              />
              <p className="font-bold text-lg">{item.building.name}</p>
              <p className="text-sm text-gray-600">Location: {item.building.location}</p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">Ideal Allocation:</span> {item.idealAllocation}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Actual Allocation:</span> {item.actualAllocation}
              </p>
            </div>
          </Link>
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
