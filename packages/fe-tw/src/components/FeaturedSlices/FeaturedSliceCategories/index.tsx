"use client";

import { buildingSliceCategories } from "@/consts/props";
import { FeaturedSliceCategory } from "../FeaturedSliceCategory";

export const FeaturedSliceCategories = () => {
    return (
        buildingSliceCategories.map((category) => (
            <FeaturedSliceCategory key={category.name} {...category} />
        ))
    );
};
