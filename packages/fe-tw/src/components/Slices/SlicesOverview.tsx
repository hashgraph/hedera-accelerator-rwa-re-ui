"use client";

import Link from "next/link";
import { buildingSlices } from "@/consts/slices";
import { slugify } from "@/utils/slugify";
import { SliceItem } from "./SliceItem";

export function SlicesOverview() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Slices</h1>
      <p className="mb-4">Select a slice to view more details.</p>
      <div className="carousel rounded-box space-x-8 my-2 p-2">
        {buildingSlices.map((slice) => (
          <div key={slice.name} className="carousel-item">
            <Link href={`/slices/${slugify(slice.name)}`}>
              <SliceItem slice={slice} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
