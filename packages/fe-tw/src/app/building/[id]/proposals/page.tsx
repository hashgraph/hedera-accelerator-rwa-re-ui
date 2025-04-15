"use client";

import { LoadingView } from "@/components/LoadingView/LoadingView";
import { ProposalsView } from "@/components/Proposals/ProposalsView";
import { useBuilding, } from "@/hooks/useBuildings";
import React, { use, type Usable } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default function ProposalsPage({ params }: Props) {
   const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
   const { data: building, isLoading } = useBuilding(id);

   if (isLoading) return <LoadingView isLoading />;

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">{building.title}: Proposals</h1>
         <ProposalsView buildingAddress={building.address!} />
      </div>
   );
}
