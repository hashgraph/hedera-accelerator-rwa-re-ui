// app/cope-dummy/page.tsx (or pages/cope-dummy.tsx)
"use client";

import React from "react";
import { CopeView } from "@/components/Cope/CopeView"; 
import type { CopeData } from "@/types/erc3643/types";

export default function CopeDummyPage() {
  const dummyCopeData: CopeData = {
    construction: {
      materials: "Concrete and steel",
      yearBuilt: "2010",
      roofType: "Flat",
      numFloors: "12",
    },
    occupancy: {
      type: "Residential",
      percentageOccupied: "85",
    },
    protection: {
      fire: "Fire station 2 miles away",
      sprinklers: "Wet pipe system",
      security: "24/7 doorman",
    },
    exposure: {
      nearbyRisks: "Adjacent gas station",
      floodZone: "Zone X",
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dummy COPE Page</h1>
      <CopeView cope={dummyCopeData} />
    </div>
  );
}
