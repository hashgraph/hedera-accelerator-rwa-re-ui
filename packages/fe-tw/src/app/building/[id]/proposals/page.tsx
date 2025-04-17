import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import { ProposalsView } from "@/components/Proposals/ProposalsView";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function ProposalsPage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: Proposals</h1>
            <ProposalsView buildingAddress={building.address!} />
         </div>
      </Suspense>
   );
}
