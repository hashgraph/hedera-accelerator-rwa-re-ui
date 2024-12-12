"use client";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { useExplorerData } from "@/hooks/useExplorerData";
import { FeaturedDevelopments } from "./FeaturedDevelopments";
import { SlicesCarousel } from "./SlicesCarousel";
import { BuildingsCarousel } from "./BuildingsCarousel";

export function ExplorerView() {
  const { slices, featuredDevelopments, singleSliceBuildings, multiSliceBuildings, selectedSlice, setSelectedSlice } = useExplorerData();

  return (
    <div>
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

          <Link href={`/slices/${slugify(selectedSlice.name)}`}>
            <h2 className="text-xl font-bold mt-8 cursor-pointer">
              {selectedSlice.name} Slice →
            </h2>
          </Link>
          <BuildingsCarousel
            buildings={singleSliceBuildings}
          />

          {multiSliceBuildings && multiSliceBuildings.buildings?.length > 0 && (
            <>
              <Link href={`/slices/${slugify(selectedSlice.name)}`}>
                <h3 className="text-lg font-semibold mt-8">
                  {selectedSlice.name} + {multiSliceBuildings.sliceName} Slice
                </h3>
              </Link>
              <BuildingsCarousel
                buildings={multiSliceBuildings.buildings}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
