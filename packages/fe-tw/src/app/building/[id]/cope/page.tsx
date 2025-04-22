import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import { CopeView } from "@/components/Cope/CopeView";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function BuildingCopePage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }
   if (!building.cope) {
      return <p>No COPE data found for {building.title}.</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: COPE</h1>
            <CopeView cope={building.cope} />
         </div>
      </Suspense>
   );
}
