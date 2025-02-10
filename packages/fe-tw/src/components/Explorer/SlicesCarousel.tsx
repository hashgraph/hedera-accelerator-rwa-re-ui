"use client";

import { SliceData } from "@/types/erc3643/types";
import { slugify } from "@/utils/slugify";
import { useCallback } from "react";

interface SlicesCarouselProps {
  slices: SliceData[];
  selectedSlice?: SliceData;
  onSelectSlice: (slice: SliceData) => void;
}

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }: SlicesCarouselProps) {
  const handleClick = useCallback(
    (slice: SliceData) => {
      onSelectSlice(slice);
    },
    [onSelectSlice],
  );

  const handleDoubleClick = useCallback(
    (slice: SliceData) => {
      if (selectedSlice?.id === slice.id) {
        window.location.href = `/slices/${slugify(slice.name)}`;
      }
    },
    [selectedSlice],
  );

  return (
    <div className="flex overflow-x-auto space-x-4 md:space-x-6 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`group flex-shrink-0 w-32 md:w-48 cursor-pointer transition-all duration-300 ${selectedSlice?.id === slice.id ? "bg-gray-100 rounded-lg" : ""
            }`}
          onClick={() => handleClick(slice)}
          onDoubleClick={() => handleDoubleClick(slice)}
        >
          <div className="flex flex-col items-center">
            {/* Avatar with Ring and Hover Effect */}
            <div className="avatar transition-transform duration-300 group-hover:scale-110">
              <div className="ring-gray-300 ring-offset-base-100 w-20 h-20 rounded-full ring ring-offset-2">
                <img
                  src={slice.imageUrl ?? "assets/dome.jpeg"}
                  alt={slice.name}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <p
              className={`my-2 text-sm md:text-md ${selectedSlice?.id === slice.id ? "font-bold" : ""
                }`}
            >
              {slice.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}