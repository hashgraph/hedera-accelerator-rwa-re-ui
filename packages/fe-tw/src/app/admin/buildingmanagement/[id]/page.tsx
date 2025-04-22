"use client";
import { BuildingManagement } from "@/components/Admin/buildingManagement";
import { useParams } from "next/navigation";

export default function BuildingManagementPage() {
   const { id } = useParams();
   return (
      <div className="p-4">
         <BuildingManagement id={id} />
      </div>
   );
}
