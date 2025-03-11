"use client";

import { SliceData } from "@/types/erc3643/types";

export function SliceItem({ slice }: { slice: SliceData }) {
  return (
    <div
      className="flex flex-col items-center justify-between p-4 rounded-md bg-white"
      style={{ width: "250px", height: "300px" }}
    >
      {/* Rectangular Image */}
      <img
        src={slice.imageIpfsUrl ?? "assets/dome.jpeg"}
        alt={slice.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold text-center">{slice.name}</h3>
      <p className="text-sm text-gray-600 text-center line-clamp-3">
        {slice.description}
      </p>
    </div>
  );
}
