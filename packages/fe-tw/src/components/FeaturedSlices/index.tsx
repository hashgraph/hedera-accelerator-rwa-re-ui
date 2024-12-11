"use client";

import { buildingSlices } from "@/consts/props"
import { FeaturedSlice } from "./FeaturedSlice"
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export const FeaturedSlices = () => {
    return (
        <div className="carousel rounded-box space-x-8 my-2 p-2">
        {buildingSlices.map((slice) => (
          <div key={slice.name} className="carousel-item">
            <Link href={`/slices/${slugify(slice.name)}`}>
                <FeaturedSlice {...slice} />
            </Link>
          </div>
        ))}
      </div>
    )
};
