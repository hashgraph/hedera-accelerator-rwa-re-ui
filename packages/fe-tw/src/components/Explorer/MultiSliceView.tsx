"use client";

import { useRef } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export function MultiSliceView({ sliceName, randomSliceName, buildings }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <>
      <h3 className="text-lg font-semibold mt-8">
        {sliceName} + {randomSliceName} Slice
      </h3>
      <div className="relative mt-4">
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition"
          style={{ transform: "translateY(-50%)" }}
        >
          ←
        </button>

        <div
          ref={scrollContainerRef}
          className="flex flex-row flex-nowrap gap-6 overflow-x-auto scroll-smooth hide-scrollbar ml-20 mr-20 py-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {buildings.map((bld) => (
            <Link
              key={bld.id}
              href={`/building/${bld.id}`}
              className="cursor-pointer flex-shrink-0"
            >
              <div className="bg-lilac rounded-lg shadow-sm p-2 transition-transform transform hover:-translate-y-1 hover:scale-102 hover:bg-lilac-dark w-36 h-48 flex flex-col items-center justify-center">
                <img
                  src={bld.imageUrl ?? "/default-building.jpg"}
                  alt={bld.title}
                  className="rounded-md object-cover w-full h-36 mb-1"
                />
                <h3 className="text-xs font-semibold text-center truncate w-full">
                  {bld.title}
                </h3>
                {bld.allocation && (
                  <p className="text-[10px] text-gray-700">
                    {bld.allocation}% Allocation
                  </p>
                )}
              </div>
            </Link>
          ))}

          {buildings.length === 0 && (
            <p className="text-sm text-gray-500 p-2">
              No buildings found that match both {sliceName} and {randomSliceName}.
            </p>
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition"
          style={{ transform: "translateY(-50%)" }}
        >
          →
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none; 
        }
      `}</style>
    </>
  );
}
