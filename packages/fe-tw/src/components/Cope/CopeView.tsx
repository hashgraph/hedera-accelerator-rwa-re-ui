"use client";

import React, { useState } from "react";
import { CopeUpdateModal } from "@/components/Cope/CopeUpdateModal";
import { CopeData } from "@/consts/cope";
import { useCopeData } from "@/hooks/useCopeData";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";

interface CopeViewProps {
  buildingAddress: `0x${string}`;
}

export function CopeView({ buildingAddress }: CopeViewProps) {
  const { isBuildingAdmin } = useBuildingDetails(buildingAddress);
  const { data, isLoading, isError, updateData, isUpdating } = useCopeData(buildingAddress);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  if (isLoading) return <div>Loading COPE data...</div>;
  if (isError) return <div>Error fetching COPE data.</div>;
  if (!data) return <div>No COPE data found for this building.</div>;

  const {
    construction,
    occupancy,
    protection,
    exposure,
    insuranceProvider,
    coverageAmount,
    coverageStart,
    coverageEnd,
    notes,
  } = data;

  function handleUpdate(newData: Partial<CopeData>) {
    if (newData) {
      updateData(newData);
    }
    setShowUpdateModal(false);
  }

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
      {/* Left Column */}
      <div className="flex-1 md:flex-[1_0_33%] bg-white rounded-lg p-8 border border-gray-300">
        <h2 className="text-xl font-semibold mb-6">Insurance Data</h2>
        <p className="text-gray-700 text-base mb-4">
          <strong>Provider:</strong> {insuranceProvider ?? "N/A"}
        </p>
        <p className="text-gray-700 text-base mb-4">
          <strong>Coverage:</strong> {coverageAmount ?? "N/A"}
        </p>
        <p className="text-gray-700 text-base mb-4">
          <strong>Start:</strong> {coverageStart ?? "N/A"}
        </p>
        <p className="text-gray-700 text-base mb-4">
          <strong>End:</strong> {coverageEnd ?? "N/A"}
        </p>
        {notes && (
          <p className="text-gray-700 text-base mb-4">
            <strong>Notes:</strong> {notes}
          </p>
        )}
        {isBuildingAdmin && (
          <button
            onClick={() => setShowUpdateModal(true)}
            className="btn btn-primary mt-6 w-full"
          >
            Update COPE Metadata
          </button>
        )}
      </div>

      {/* Right Column */}
      <div className="flex-1 md:flex-[2_0_66%] grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Construction */}
        <div className="bg-gray-100 rounded-lg p-6 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200">
          <h3 className="text-lg font-medium mb-2">Construction</h3>
          <p className="text-base"><strong>Materials:</strong> {construction?.materials ?? "N/A"}</p>
          <p className="text-base"><strong>Year Built:</strong> {construction?.yearBuilt ?? "N/A"}</p>
          <p className="text-base"><strong>Roof Type:</strong> {construction?.roofType ?? "N/A"}</p>
          <p className="text-base"><strong>Floors:</strong> {construction?.numFloors ?? "N/A"}</p>
        </div>

        {/* Occupancy */}
        <div className="bg-gray-100 rounded-lg p-6 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200">
          <h3 className="text-lg font-medium mb-2">Occupancy</h3>
          <p className="text-base"><strong>Type:</strong> {occupancy?.type ?? "N/A"}</p>
          <p className="text-base"><strong>% Occupied:</strong> {occupancy?.percentageOccupied ?? "N/A"}</p>
        </div>

        {/* Protection */}
        <div className="bg-gray-100 rounded-lg p-6 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200">
          <h3 className="text-lg font-medium mb-2">Protection</h3>
          <p className="text-base"><strong>Fire Protection:</strong> {protection?.fire ?? "N/A"}</p>
          <p className="text-base"><strong>Sprinklers:</strong> {protection?.sprinklers ?? "N/A"}</p>
          <p className="text-base"><strong>Security:</strong> {protection?.security ?? "N/A"}</p>
        </div>

        {/* Exposure */}
        <div className="bg-gray-100 rounded-lg p-6 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200">
          <h3 className="text-lg font-medium mb-2">Exposure</h3>
          <p className="text-base"><strong>Nearby Risks:</strong> {exposure?.nearbyRisks ?? "N/A"}</p>
          <p className="text-base"><strong>Flood Zone:</strong> {exposure?.floodZone ?? "N/A"}</p>
        </div>
      </div>

      {showUpdateModal && (
        <CopeUpdateModal
          data={data}
          onUpdate={handleUpdate}
          onClose={() => setShowUpdateModal(false)}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
