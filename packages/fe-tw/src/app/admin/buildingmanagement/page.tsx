"use client";

import { BuildingManagementView } from "@/components/Admin/BuildingManagementView";
import { useSearchParams } from "next/navigation";
import { BuildingManagement } from "@/components/Admin/buildingManagement";

export default function BuildingManagementPage() {
   const params = useSearchParams();

   return (
      <div className="p-4">
         <BuildingManagement />

         {/*<BuildingManagementView governance={params.get('governance') === 'true'} bAddress={params.get('bAddress') as `0x${string}`} />*/}
      </div>
   );
}
