"use client";

import { useSlicesData } from "@/hooks/useSlicesData";
import { slugify } from "@/utils/slugify";
import Link from "next/link";
import { SliceItem } from "./SliceItem";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function SlicesOverview() {
   const { slices } = useSlicesData();

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href="/explorer">Explorer</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>Slices</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Slices Catalogue</h1>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
               Slices are smart contracts that help manage diversified allocations across assets.
               They rebalance portfolios periodically to match predefined allocations, making it
               easy for users to participate in DeFi strategies.
            </p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {slices.map((slice) => (
               <Link key={slice.id} href={`/slices/${slugify(slice.id)}`}>
                  <div
                     className="
                bg-white border border-gray-300 rounded-lg p-4 shadow-md
                hover:scale-[1.02] cursor-pointer
                transition-transform duration-200
              "
                  >
                     <SliceItem slice={slice} />
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
}
