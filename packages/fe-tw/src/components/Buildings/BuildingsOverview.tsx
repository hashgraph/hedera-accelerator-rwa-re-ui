"use client";

import { useBuildings } from "@/hooks/useBuildings";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export function BuildingsOverview() {
   const { buildings } = useBuildings();

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {buildings.map((building) => (
               <Card
                  key={building.id}
                  className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer p-0 pb-6 gap-2"
               >
                  <Link href={`/building/${building.id}`}>
                     <>
                        <img
                           src={building.imageUrl ?? "assets/dome.jpeg"}
                           alt={building.title}
                           className="w-full h-32 object-cover rounded-t-md mb-3 top-0"
                        />
                        <CardContent>
                           <h3 className="text-lg font-semibold">{building.title}</h3>
                           <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                              {building.description ?? "No description available"}
                           </p>
                        </CardContent>
                     </>
                  </Link>
               </Card>
            ))}
         </div>
      </div>
   );
}
