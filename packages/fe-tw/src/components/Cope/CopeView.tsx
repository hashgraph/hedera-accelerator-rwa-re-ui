"use client";

import type { CopeData } from "@/types/erc3643/types";
import React from "react";

interface CopeViewProps {
  cope?: CopeData;
}

export function CopeView({ cope = {} as CopeData }: CopeViewProps) {
  const { construction, occupancy, protection, exposure } = cope;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Construction Card */}
      <div className="bg-gray-50 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Construction</h2>
        <p>
          <strong>Materials:</strong> {construction?.materials || "N/A"}
        </p>
        <p>
          <strong>Year Built:</strong> {construction?.yearBuilt || "N/A"}
        </p>
        <p>
          <strong>Roof Type:</strong> {construction?.roofType || "N/A"}
        </p>
        <p>
          <strong>Floors:</strong> {construction?.numFloors || "N/A"}
        </p>
      </div>

      {/* Occupancy Card */}
      <div className="bg-gray-50 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Occupancy</h2>
        <p>
          <strong>Type:</strong> {occupancy?.type || "N/A"}
        </p>
        <p>
          <strong>% Occupied:</strong> {occupancy?.percentageOccupied || "N/A"}
        </p>
      </div>

      {/* Protection Card */}
      <div className="bg-gray-50 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Protection</h2>
        <p>
          <strong>Fire Protection:</strong> {protection?.fire || "N/A"}
        </p>
        <p>
          <strong>Sprinklers:</strong> {protection?.sprinklers || "N/A"}
        </p>
        <p>
          <strong>Security:</strong> {protection?.security || "N/A"}
        </p>
      </div>

      {/* Exposure Card */}
      <div className="bg-gray-50 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Exposure</h2>
        <p>
          <strong>Nearby Risks:</strong> {exposure?.nearbyRisks || "N/A"}
        </p>
        <p>
          <strong>Flood Zone:</strong> {exposure?.floodZone || "N/A"}
        </p>
      </div>
    </div>
  );
}
