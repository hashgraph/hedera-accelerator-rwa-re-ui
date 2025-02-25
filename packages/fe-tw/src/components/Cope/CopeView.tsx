"use client";

import React from "react";
import { use, Usable } from "react";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { useBuildings } from "@/hooks/useBuildings";

type Props = {
  params: Promise<{ id: string }>;
};

export default function BuildingCopePage({ params }: Props) {
  const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
  const { buildings } = useBuildings();

  if (!id || buildings.length === 0) {
    return <LoadingView isLoading />;
  }

  const building = buildings.find(b => b.id === id);
  if (!building) {
    return <p>Not found</p>;
  }

  if (!building.cope) {
    return <p>No COPE data found in metadata for {building.title}.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {building.title} - COPE Info
      </h1>
      <CopeView cope={building.cope} />
    </div>
  );
}

export function CopeView({ cope }: { cope: any }) {
  const { construction, occupancy, protection, exposure } = cope;

  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">Construction</h2>
      <p>Materials: {construction?.materials || "N/A"}</p>
      <p>Year Built: {construction?.yearBuilt || "N/A"}</p>
      <p>Roof Type: {construction?.roofType || "N/A"}</p>
      <p>Floors: {construction?.numFloors || "N/A"}</p>

      <h2 className="text-lg font-semibold mt-4">Occupancy</h2>
      <p>Type: {occupancy?.type || "N/A"}</p>
      <p>Percentage: {occupancy?.percentageOccupied || "N/A"}</p>

      <h2 className="text-lg font-semibold mt-4">Protection</h2>
      <p>Fire: {protection?.fire || "N/A"}</p>
      <p>Sprinklers: {protection?.sprinklers || "N/A"}</p>
      <p>Security: {protection?.security || "N/A"}</p>

      <h2 className="text-lg font-semibold mt-4">Exposure</h2>
      <p>Nearby Risks: {exposure?.nearbyRisks || "N/A"}</p>
      <p>Flood Zone: {exposure?.floodZone || "N/A"}</p>
    </div>
  );
}
