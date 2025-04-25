import { getSliceTags } from "@/utils/tagFilters";
import { useEffect, useMemo, useState } from "react";
import { useBuildings } from "./useBuildings";
import { useSlicesData } from "./useSlicesData";
import { SliceData } from "@/types/erc3643/types";

enum LocalStorageKeys {
   FEATURED_SLICES = 'FEATURED_SLICES',
   FEATURED_BUILDINGS = 'FEATURED_BUILDINGS',
};

const storedFeaturedSlices = localStorage.getItem(LocalStorageKeys.FEATURED_SLICES);
const storedFeaturedBuildings = localStorage.getItem(LocalStorageKeys.FEATURED_BUILDINGS);

const getFeaturedItems = (items: any[], addedItems: any[], max: number) => {
   if (addedItems.length === max) {
      return addedItems;
   }

   const sliceRandomId = Math.floor(Math.random() * items.length);

   if (!addedItems.find(item => item.id === items[sliceRandomId].id)) {
      addedItems.push(items[sliceRandomId]);
   }

   return getFeaturedItems(items, addedItems, max);
};

const MAX_ITEMS_COUNT = 5;

export function useExplorerData() {
   const { slices } = useSlicesData();
   const { buildings } = useBuildings();
   const [featuredSlices, setFeaturedSlices] =
      useState(storedFeaturedSlices !== null ? JSON.parse(storedFeaturedSlices) : null);
   const [featuredBuildings, setFeaturedBuildings] =
      useState(storedFeaturedBuildings !== null ? JSON.parse(storedFeaturedBuildings) : null);
   const [selectedSlice, setSelectedSlice] = useState<SliceData>();

   useEffect(() => {
      if (!featuredSlices && slices?.length) {
         const slicesToStore = getFeaturedItems(slices, [], slices.length < MAX_ITEMS_COUNT ? slices.length : MAX_ITEMS_COUNT);
         localStorage.setItem(LocalStorageKeys.FEATURED_SLICES, JSON.stringify(slicesToStore));
         setFeaturedSlices(slicesToStore);
      }
   }, [featuredSlices, slices]);

   useEffect(() => {
      if (!featuredBuildings && buildings?.length) {
         const buildingsToStore = getFeaturedItems(buildings, [], buildings.length < MAX_ITEMS_COUNT ? buildings.length : MAX_ITEMS_COUNT);
         localStorage.setItem(LocalStorageKeys.FEATURED_BUILDINGS, JSON.stringify(buildingsToStore));
         setFeaturedBuildings(buildingsToStore);
      }
   }, [featuredBuildings, buildings]);

   useEffect(() => {
      if (!selectedSlice && featuredSlices?.length > 0) {
         setSelectedSlice(featuredSlices[0]);
      }
   }, [featuredSlices, selectedSlice]);

   const selectedSliceTags = useMemo(
      () => (selectedSlice ? getSliceTags(selectedSlice.name) : []),
      [selectedSlice],
   );

   return {
      slices,
      buildings,
      featuredSlices,
      featuredBuildings,
      featuredDevelopments: [],
      selectedSlice,
      setSelectedSlice,
   };
}
