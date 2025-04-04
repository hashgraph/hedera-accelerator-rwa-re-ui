"use client";

import { BuildingManagementView } from "@/components/Admin/BuildingManagementView";
import { useSearchParams } from "next/navigation";

export default function BuildingManagementPage() {
   const params = useSearchParams();

   return (
      <div className="p-4">
         <BuildingManagementView governance={params.get('governance') === 'true'} />
      </div>
   );
}
