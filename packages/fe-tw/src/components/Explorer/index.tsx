"use client";

import { useState, useMemo } from "react";
import { slices, buildings, featuredDevelopments } from "@/consts/props";
import { tokenize, getSliceTags, getBuildingTags, buildingMatchesSlice } from "@/utils/tagFilters";

import { SlicesCarousel } from "./SlicesCarousel";
import { FeaturedDevelopments as FeaturedDevs } from "./FeaturedDevelopments";
import { SingleSliceView } from "./SingleSliceView";
import { MultiSliceView } from "./MultiSliceView";

export const Explorer = () => {
  const [selectedSlice, setSelectedSlice] = useState(slices[0]);

  const selectedSliceTags = useMemo(() => getSliceTags(selectedSlice.name), [selectedSlice]);

  const filteredDevelopments = useMemo(() => {
    return featuredDevelopments.filter(dev => {
      const devTags = tokenize(dev.location);
      return selectedSliceTags.every(t => devTags.includes(t));
    });
  }, [selectedSliceTags]);

  const otherSlices = useMemo(() => slices.filter(s => s.id !== selectedSlice.id), [selectedSlice]);
  const randomSlice = useMemo(() => {
    if (otherSlices.length === 0) return null;
    return otherSlices[Math.floor(Math.random() * otherSlices.length)];
  }, [otherSlices]);

  const randomSliceTags = useMemo(() => (randomSlice ? getSliceTags(randomSlice.name) : []), [randomSlice]);

  const singleSliceBuildings = useMemo(() => {
    return buildings.filter(b => buildingMatchesSlice(getBuildingTags(b), selectedSliceTags));
  }, [selectedSliceTags]);

  const combinedBuildings = useMemo(() => {
    if (!randomSlice) return [];
    const combinedTags = [...selectedSliceTags, ...randomSliceTags];
    return buildings.filter(b => buildingMatchesSlice(getBuildingTags(b), combinedTags));
  }, [randomSlice, selectedSliceTags, randomSliceTags]);

  return (
    <div className="my-2">
      <SlicesCarousel
        slices={slices}
        selectedSlice={selectedSlice}
        onSelectSlice={setSelectedSlice}
      />

      {selectedSlice && (
        <div className="mt-6">
          <FeaturedDevs
            selectedSliceName={selectedSlice.name}
            developments={filteredDevelopments}
          />

          <SingleSliceView
            sliceName={selectedSlice.name}
            buildings={singleSliceBuildings}
          />

          {randomSlice && (
            <MultiSliceView
              sliceName={selectedSlice.name}
              randomSliceName={randomSlice.name}
              buildings={combinedBuildings}
            />
          )}
        </div>
      )}
    </div>
  );
};
