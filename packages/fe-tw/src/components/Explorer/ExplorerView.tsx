"use client";

import { useExplorerData } from "@/hooks/useExplorerData";
import Link from "next/link";
import { BuildingsCarousel } from "./BuildingsCarousel";
import { FeaturedDevelopments } from "./FeaturedDevelopments";
import { SlicesCarousel } from "./SlicesCarousel";

export function ExplorerView() {
   const {
      featuredDevelopments,
      featuredBuildings,
      selectedSlice,
      featuredSlices,
      setSelectedSlice,
   } = useExplorerData();

   return (
      <div className="max-w-(--breakpoint-xl) mx-auto px-8 md:px-12 lg:px-20">
        <Link href={"/slices"}>
          <h2 className="text-xl font-bold mt-8 cursor-pointer">Featured Slices</h2>
        </Link>
        {featuredSlices?.length && <SlicesCarousel
            slices={featuredSlices}
            selectedSlice={selectedSlice}
            onSelectSlice={setSelectedSlice}
        />}

        {!!selectedSlice?.id && (
          <div className="mt-6">
            <FeaturedDevelopments
              selectedSlice={selectedSlice}
              developments={featuredDevelopments}
            />
          </div>
        )}
       
        <Link href="/building">
          <h2 className="text-xl font-bold mt-8 mb-2 cursor-pointer">Featured Buildings</h2>
        </Link>
        {featuredBuildings?.length &&
          <BuildingsCarousel buildings={featuredBuildings} />
        }
    </div>
  );
}
