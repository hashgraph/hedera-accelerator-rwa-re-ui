import { fetchBuildingInfo } from "@/hooks/useBuildings/helpers";
import { ExpensesView } from "@/components/Expenses/ExpensesView";
import React, { Suspense } from "react";

type Props = {
   params: Promise<{ id: string }>;
};

export default async function ExpensesPage({ params }: Props) {
   const id = await params.then((res) => res.id);
   const building = await fetchBuildingInfo(id);

   if (!building) {
      return <p>Not found</p>;
   }

   return (
      <Suspense fallback={"Loading..."}>
         <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{building.title}: Expenses</h1>
            <ExpensesView buildingAddress={building.address!} />
         </div>
      </Suspense>
   );
}
