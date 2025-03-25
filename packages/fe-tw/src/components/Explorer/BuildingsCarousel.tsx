"use client";

import type { BuildingData } from "@/types/erc3643/types";
import Link from "next/link";
import { useState } from "react";

type Props = {
   title?: string;
   buildings: BuildingData[];
};

export function BuildingsCarousel({ title, buildings }: Props) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const itemsPerPage = 4;
   const totalPages = Math.ceil(buildings.length / itemsPerPage);

   const goToPrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
   };

   const goToNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
   };

   const visibleBuildings = buildings.slice(
      currentIndex * itemsPerPage,
      currentIndex * itemsPerPage + itemsPerPage,
   );

   return (
      <div className="mt-4">
         {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
         <div className="relative">
            {/* Previous Button */}
            <button
               type="button"
               onClick={goToPrevious}
               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-gray-200 bg-opacity-70 text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition-all"
            >
               ❮
            </button>

            {/* Building Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
               {visibleBuildings.map((bld) => (
                  <Link key={bld.id} href={`/building/${bld.id}`} className="cursor-pointer">
                     <div className="bg-accent text-gray-800 rounded-lg shadow-md p-4 hover:scale-105 hover:bg-accent-focus transition-all duration-300">
                        <img
                           src={bld.imageUrl ?? "assets/dome.jpeg"}
                           alt={bld.title}
                           className="rounded-md object-cover w-full h-40 mb-2"
                        />
                        <h3 className="text-sm font-semibold text-center truncate">{bld.title}</h3>
                        {typeof bld.allocation === "number" && (
                           <p className="text-xs text-gray-700">{bld.allocation}% Allocation</p>
                        )}
                     </div>
                  </Link>
               ))}
            </div>

            {/* Next Button */}
            <button
               type="button"
               onClick={goToNext}
               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle bg-gray-200 bg-opacity-70 text-gray-500 hover:bg-gray-300 hover:text-gray-600 transition-all"
            >
               ❯
            </button>
         </div>
      </div>
   );
}
