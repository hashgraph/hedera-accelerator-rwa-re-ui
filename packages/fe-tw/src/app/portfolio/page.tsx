import { Portfolio } from "@/components/User/Portfolio";
import { Suspense } from "react";

export default function BuildingIndexPage() {
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Portfolio />
         </Suspense>
      </div>
   );
}
