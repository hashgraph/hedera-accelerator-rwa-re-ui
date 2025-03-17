"use client";

import Allocations from "@/components/Slices/Allocations";
import { useBuildings } from "@/hooks/useBuildings";
import { useSliceData } from "@/hooks/useSliceData";
import type { BuildingToken, SliceData } from "@/types/erc3643/types";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import React, { useState } from "react";
import { BuildingDetailsView } from "../FetchViews/BuildingDetailsView";
import { AllocationBuildingToken } from "./AllocationBuildingToken";

interface ExtendedSliceData extends SliceData {
  sliceValuation: number;
  tokenPrice: number;
  tokenBalance: number;
}

type Props = {
  sliceData: ExtendedSliceData;
  isInBuildingContext?: boolean;
  buildingId?: string;
};

export function SliceDetailPage({
  sliceData,
  isInBuildingContext = false,
  buildingId,
}: Props) {
  const [buildingDeployedTokens, setBuildingDeployedTokens] = useState<
    BuildingToken[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { buildings } = useBuildings();
  const { sliceAllocations, sliceBuildings } = useSliceData(
    sliceData.address,
    buildingDeployedTokens,
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmRebalance = () => {
    // todo: add rebalance() call
    closeModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="breadcrumbs text-sm text-gray-700">
        <ul className="items-center">
          <li>
            <Link
              href="/explorer"
              className="flex items-center text-purple-800 hover:underline"
            >
              <ArrowBack fontSize="small" />
              <span className="ml-2">Explorer</span>
            </Link>
          </li>

          {isInBuildingContext && buildingId ? (
            <li>
              <Link
                href={`/building/${buildingId}/slices`}
                className="text-purple-800 hover:underline"
              >
                Slices
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/slices" className="text-purple-800 hover:underline">
                Slices
              </Link>
            </li>
          )}

          <li>
            <span className="font-semibold">{sliceData.name}</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 md:h-64 w-full h-64">
          <img
            src={sliceData.imageIpfsUrl ?? "/assets/dome.jpeg"}
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
            <p className="mb-1">
              Slice Valuation: ${sliceData.sliceValuation ?? "-"}
            </p>
            <p className="mb-1">Token Price: ${sliceData.tokenPrice ?? "-"}</p>
            <p>Your Balance: {sliceData.tokenBalance ?? 0} tokens</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Slice Token Allocations
          </h2>
          <button
            type="button"
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-900 transition"
            onClick={openModal}
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sliceAllocations.map((item) => (
            <AllocationBuildingToken
              key={item.aToken}
              allocation={item}
              sliceBuildings={sliceBuildings}
            />
          ))}
        </div>
      </div>

      {buildings.map((building) => (
        <BuildingDetailsView
          key={building.id}
          address={building.address as `0x${string}`}
          setBuildingTokens={setBuildingDeployedTokens}
        />
      ))}

      <Allocations
        isOpen={isModalOpen}
        allocations={sliceAllocations}
        sliceBuildings={sliceBuildings}
        onClose={closeModal}
        onConfirm={handleConfirmRebalance}
      />
    </div>
  );
}
