import { useState, useMemo } from "react";
import { getExplorerData } from "@/services/explorerService";
import { getSliceTags, buildingMatchesSlice, getBuildingTags, tokenize } from "@/utils/tagFilters";

export function useExplorerData() {
  const { slices, buildings, featuredDevelopments } = getExplorerData(); 
  //happy mocking

  const [selectedSlice, setSelectedSlice] = useState(slices[0]);

  const selectedSliceTags = useMemo(() => selectedSlice ? getSliceTags(selectedSlice.name) : [], [selectedSlice]);

  const filteredDevelopments = useMemo(() => {
    return featuredDevelopments.filter(dev => {
      const devTags = tokenize(dev.location);
      return selectedSliceTags.every(t => devTags.includes(t));
    });
  }, [featuredDevelopments, selectedSliceTags]);

  // single slice buildings
  const singleSliceBuildings = useMemo(() => {
    return buildings.filter(b => buildingMatchesSlice(getBuildingTags(b), selectedSliceTags));
  }, [buildings, selectedSliceTags]);

  // multi-slice logic with rand
  const otherSlices = useMemo(() => slices.filter(s => s.id !== selectedSlice?.id), [slices, selectedSlice]);
  const randomSlice = useMemo(() => {
    if (otherSlices.length === 0) return null;
    return otherSlices[Math.floor(Math.random() * otherSlices.length)];
  }, [otherSlices]);

  const randomSliceTags = useMemo(() => (randomSlice ? getSliceTags(randomSlice.name) : []), [randomSlice]);

  const combinedBuildings = useMemo(() => {
    if (!randomSlice) return null;
    const combinedTags = [...selectedSliceTags, ...randomSliceTags];
    const blds = buildings.filter(b => buildingMatchesSlice(getBuildingTags(b), combinedTags));
    return { sliceName: randomSlice.name, buildings: blds };
  }, [randomSlice, selectedSliceTags, randomSliceTags, buildings]);

  return {
    slices,
    featuredDevelopments: filteredDevelopments,
    singleSliceBuildings,
    multiSliceBuildings: combinedBuildings,
    selectedSlice,
    setSelectedSlice
  };
}
