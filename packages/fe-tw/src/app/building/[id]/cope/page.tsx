"use client";

import { CopeView } from "@/components/Cope/CopeView";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { useBuilding } from "@/hooks/useBuildings";
import React from "react";
import { type Usable, use } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default function BuildingCopePage({ params }: Props) {
   const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
   const { data: building, isLoading } = useBuilding(id);

   if (isLoading) return <LoadingView isLoading />;

   if (!building) {
      return <p>Not found</p>;
   }

   if (!building.cope) {
      return <p>No COPE data found for {building.title}.</p>;
   }

   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">{building.title}: COPE</h1>

         <CopeView cope={building.cope} />
      </div>
   );
}
