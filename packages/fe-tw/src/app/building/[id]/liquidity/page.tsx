import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import { BuildingAddLiquidity } from "@/components/Buildings/BuildingLiquidity";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function LiquidityPage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: Mint and Liquidity</h1>
            <BuildingAddLiquidity buildingAddress={building.address as `0x${string}`} buildingId={id} />
         </div>
      </Suspense>
   );
}
