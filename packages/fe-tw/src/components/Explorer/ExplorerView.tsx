"use client";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { useExplorerData } from "@/hooks/useExplorerData";
import { FeaturedDevelopments } from "./FeaturedDevelopments";
import { SlicesCarousel } from "./SlicesCarousel";
import { BuildingsCarousel } from "./BuildingsCarousel";

export function ExplorerView() {
  const { slices, featuredDevelopments, buildings, multiSliceBuildings, selectedSlice, setSelectedSlice } = useExplorerData();

  return (
    <div className="max-w-screen-xl mx-auto px-8 md:px-12 lg:px-20">
      <Link href={`/slices`}>
        <h2 className="text-lg font-semibold mt-8">
          Featured Slices →
        </h2>
      </Link>
      <br />

      <SlicesCarousel
        slices={slices}
        selectedSlice={selectedSlice}
        onSelectSlice={setSelectedSlice}
      />

      {selectedSlice && (
        <div className="mt-6">
          <FeaturedDevelopments
            selectedSliceName={selectedSlice.name}
            developments={featuredDevelopments}
          />

          <Link href="/building">
            <h2 className="text-xl font-bold mt-8 cursor-pointer">
              All Buildings
            </h2>
          </Link>
          <BuildingsCarousel buildings={buildings} />

          {multiSliceBuildings && multiSliceBuildings.buildings?.length > 0 && (
            <>
              <Link href={`/slices/${slugify(selectedSlice.name)}`}>
                <h2 className="text-lg font-semibold mt-8">
                  {selectedSlice.name} + {multiSliceBuildings.sliceName} Slice →
                </h2>
              </Link>
              <BuildingsCarousel buildings={multiSliceBuildings.buildings} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
