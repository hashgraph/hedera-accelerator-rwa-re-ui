"use client";

import Link from "next/link";
import { useRef } from "react";

type Building = {
  id: number;
  title: string;
  imageUrl?: string;
  allocation?: number;
};

type Props = {
  title?: string;
  buildings: Building[];
};

export function BuildingsCarousel({ title, buildings }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="mt-4">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-sm w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          ←
        </button>

        <div
          ref={scrollContainerRef}
          className="flex flex-row flex-nowrap gap-8 overflow-x-auto scroll-smooth hide-scrollbar ml-10 mr-10 py-4"
        >
          {buildings.map((bld) => (
            <Link key={bld.id} href={`/building/${bld.id}`} className="cursor-pointer flex-shrink-0">
              <div className="bg-lilac rounded-lg shadow-sm p-4 hover:scale-105 hover:bg-lilac-dark w-48 h-60 flex flex-col items-center justify-center transition-all duration-300">
                <img
                  src={bld.imageUrl ?? "/default-building.jpg"}
                  alt={bld.title}
                  className="rounded-md object-cover w-full h-40 mb-2"
                />
                <h3 className="text-sm font-semibold text-center truncate w-full">
                  {bld.title}
                </h3>
                {typeof bld.allocation === "number" && (
                  <p className="text-xs text-gray-700">
                    {bld.allocation}% Allocation
                  </p>
                )}
              </div>
            </Link>
          ))}

          {buildings.length === 0 && (
            <p className="text-sm text-gray-500 p-2">No buildings found.</p>
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-sm w-12 h-12 flex items-center justify-center hover:bg-gray-100"
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
    </div>
  );
}
