import { getExplorerData } from "@/services/explorerService";
import { buildingMatchesSlice, getBuildingTags, getSliceTags, tokenize } from "@/utils/tagFilters";
import { useEffect, useMemo, useState } from "react";
import { useBuildings } from "./useBuildings";

export function useExplorerData() {
   const { slices, featuredDevelopments } = getExplorerData();
   const { buildings } = useBuildings();

   const [selectedSlice, setSelectedSlice] = useState(slices[0]);

   useEffect(() => {
      if (!selectedSlice) {
         setSelectedSlice(slices[0]);
      }
   }, [slices]);

   const selectedSliceTags = useMemo(
      () => (selectedSlice ? getSliceTags(selectedSlice.name) : []),
      [selectedSlice],
   );

   const filteredDevelopments = useMemo(() => {
      return featuredDevelopments.filter((dev) => {
         const devTags = tokenize(dev.location);
         return selectedSliceTags.every((t) => devTags.includes(t));
      });
   }, [featuredDevelopments, selectedSliceTags]);

   // multi-slice logic with rand
   const otherSlices = useMemo(
      () => slices.filter((s) => s.id !== selectedSlice?.id),
      [slices, selectedSlice],
   );
   const randomSlice = useMemo(() => {
      if (otherSlices.length === 0) return null;
      return otherSlices[Math.floor(Math.random() * otherSlices.length)];
   }, [otherSlices]);

   const randomSliceTags = useMemo(
      () => (randomSlice ? getSliceTags(randomSlice.name) : []),
      [randomSlice],
   );

   const combinedBuildings = useMemo(() => {
      if (!randomSlice) return null;
      const combinedTags = [...selectedSliceTags, ...randomSliceTags];
      const blds = buildings.filter((b) => buildingMatchesSlice(getBuildingTags(b), combinedTags));
      return { sliceName: randomSlice.name, buildings: blds };
   }, [randomSlice, selectedSliceTags, randomSliceTags, buildings]);

   return {
      slices,
      featuredDevelopments: filteredDevelopments,
      multiSliceBuildings: combinedBuildings,
      selectedSlice,
      buildings,
      setSelectedSlice,
   };
}
