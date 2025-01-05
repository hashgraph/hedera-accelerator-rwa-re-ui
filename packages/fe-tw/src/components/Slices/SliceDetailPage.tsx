"use client";

import React, { useState } from "react";
import Allocations from "@/components/Slices/Allocations";
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

type ExtendedSliceData = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  sliceValuation?: number;
  tokenPrice?: number;
  userBalance?: number;
};

type SliceDetailProps = {
  sliceData: ExtendedSliceData;
  tokensWithBuilding: TokenWithBuilding[];
};

export function SliceDetailPage({ sliceData, tokensWithBuilding }: SliceDetailProps) {
  const [allocations, setAllocations] = useState<TokenWithBuilding[]>(tokensWithBuilding);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Demo: set actualAllocation to idealAllocation in the FE
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
    <div className="p-6">

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 md:h-64 w-full h-64">
          <img
            src={sliceData.imageUrl ?? "/default-building.jpg"}
            alt={sliceData.name}
            className="object-cover rounded-lg w-full h-full"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{sliceData.name}</h1>
          {sliceData.description && (
            <p className="text-base mb-4">{sliceData.description}</p>
          )}

          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Slice Info</h2>
            <p className="mb-1">Slice Valuation: ${sliceData.sliceValuation ?? "-"}</p>
            <p className="mb-1">Token Price: ${sliceData.tokenPrice ?? "-"}</p>
            <p>Your Balance: {sliceData.userBalance ?? 0} tokens</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Token Allocations
          </h2>
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition"
            onClick={openModal}
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allocations.map((item) => (
            <Link key={item.tokenAddress} href={`/building/${item.building.nftId ?? ""}`}>
              <div
                className="p-4 rounded-lg bg-[#F9F3F8] hover:bg-[#EADFEA] transition duration-200 cursor-pointer"
              >
                <img
                  src={item.building.image ?? "/default-building.jpg"}
                  alt={item.building.name ?? "Unnamed Building"}
                  className="mb-2 w-full h-32 object-cover rounded"
                />
                <p className="font-bold text-lg">{item.building.name}</p>
                <p className="text-sm text-gray-600">
                  Location: {item.building.location}
                </p>
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
      </div>

      <Allocations
        isOpen={isModalOpen}
        allocations={allocations}
        onClose={closeModal}
        onConfirm={handleConfirmRebalance}
        onCancel={closeModal}
      />
    </div>
  );
}
