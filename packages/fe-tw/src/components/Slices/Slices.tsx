"use client";

import Link from "next/link";
import { buildingSlices } from "@/consts/props";
import { slugify } from "@/utils/slugify";
import { SliceItem } from "./SlicesItem/";

export function Slices() {
  return (
    <div className="carousel rounded-box space-x-8 my-2 p-2">
      {buildingSlices.map((slice) => (
        <div key={slice.name} className="carousel-item">
          <Link href={`/slices/${slugify(slice.name)}`}>
            <SliceItem slice={slice} />
          </Link>
        </div>
      ))}
    </div>
  );
}
