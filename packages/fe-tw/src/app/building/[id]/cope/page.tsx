"use client";

import React from "react";
import { use, Usable } from "react";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { useBuildings } from "@/hooks/useBuildings";
import { CopeView } from "@/components/Cope/CopeView"; 

type Props = {
  params: Promise<{ id: string }>;
};

export default function BuildingCopePage({ params }: Props) {
  const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
  const { buildings } = useBuildings();

  if (!id || buildings.length === 0) {
    return <LoadingView isLoading />;
  }

  const building = buildings.find((b) => b.id === id);
  if (!building) {
    return <p>Not found</p>;
  }

  if (!building.cope) {
    return <p>No COPE data found for {building.title}.</p>;
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
