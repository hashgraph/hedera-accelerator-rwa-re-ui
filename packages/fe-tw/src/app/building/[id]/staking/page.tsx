import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import StakingComponent from "@/components/Staking/StakingOverview";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function StakingPage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: Staking</h1>
            <StakingComponent buildingId={id} />
         </div>
      </Suspense>
   );
}
