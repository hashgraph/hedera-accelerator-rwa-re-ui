"use client";

import { LoadingView } from "@/components/LoadingView/LoadingView";
import { PaymentsView } from "@/components/Payments/PaymentsView";
import { useBuildings } from "@/hooks/useBuildings";
import React, { use, type Usable } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function PaymentsPage({ params }: Props) {
  const { id } = use<{ id: string }>(
    params as unknown as Usable<{ id: string }>,
  );
  const { buildings } = useBuildings();
  const building = buildings.find((_building) => _building.id === id);

  if (!buildings?.length || !id) {
    return <LoadingView isLoading />;
  }
  if (!building) {
    return <p>Not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{building.title}: Payments</h1>
      <PaymentsView buildingId={id} />
    </div>
  );
}
