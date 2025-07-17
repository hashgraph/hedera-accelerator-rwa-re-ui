import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import { AuditView } from "@/components/Audit/AuditView";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function AuditPage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: Audit Records</h1>
            <AuditView buildingId={id} buildingAddress={building.address!} />
         </div>
      </Suspense>
   );
}
