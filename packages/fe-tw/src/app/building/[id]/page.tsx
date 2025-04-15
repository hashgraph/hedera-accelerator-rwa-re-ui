"use client";

import { BuildingDetailPage } from "@/components/Buildings/BuildingDetailsPage";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { useBuilding } from "@/hooks/useBuildings";
import React, { use, type Usable } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default function Home({ params }: Props) {
   const { id } = use<{ id: string }>(params as unknown as Usable<{ id: string }>);
   const { data: building, isLoading } = useBuilding(id);

   if (isLoading) return <LoadingView isLoading />;

   if (!building) {
      return <p>Not found</p>;
   }

   return <BuildingDetailPage {...building} />;
}
