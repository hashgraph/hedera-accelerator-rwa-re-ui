import { BuildingsOverview } from "@/components/Buildings/BuildingsOverview";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";

export default function BuildingIndexPage() {
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <BuildingInfo />
         <Suspense fallback={<div className="text-center">Loading...</div>}>
            <BuildingsOverview />
         </Suspense>
      </div>
   );
}

const BuildingInfo = () => {
   return (
      <>
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href="/explorer">Explorer</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>Building</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Buildings Catalogue</h1>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
               Explore the buildings in our ecosystem. Each building is tokenized and forms part of
               the investment opportunities in the platform.
            </p>
         </div>
      </>
   );
};
