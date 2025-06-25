"use client";

import { LoadingView } from "@/components/LoadingView/LoadingView";
import SliceCardGrid from "@/components/Slices/SliceCardGrid";
import { useBuilding } from "@/hooks/useBuildings";
import React, { use, type Usable } from "react";
import { useSlicesData } from "@/hooks/useSlicesData";

type Props = {
   params: Promise<{ id: string }>;
};

export default function BuildingSlicesPage({ params }: Props) {
   const { id } = use<{ id: `0x${string}` }>(params as unknown as Usable<{ id: `0x${string}` }>);
   const { data: building, isLoading } = useBuilding(id);
   const { buildingToSlices } = useSlicesData();

   if (isLoading) {
      return <LoadingView isLoading />;
   }
   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold">{building.title}: Slices</h1>

         {buildingToSlices?.[id] ? (
            <SliceCardGrid sliceIds={buildingToSlices[id].map((slice) => slice.id)} />
         ) : (
            <p>No slices found for a building</p>
         )}
      </div>
   );
}
