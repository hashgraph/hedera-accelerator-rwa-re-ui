"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { slugify } from "@/utils/slugify";
import { useCallback } from "react";

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }) {
  const handleClick = useCallback(
    (slice) => {
      onSelectSlice(slice);
    },
    [onSelectSlice]
  );

  const handleDoubleClick = useCallback(
    (slice) => {
      // route to detail page on double click
      if (selectedSlice?.id === slice.id) {
        window.location.href = `/slices/${slugify(slice.name)}`;
      }
    },
    [selectedSlice]
  );

  return (
    <div className="flex overflow-x-auto space-x-4 md:space-x-6 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`flex-shrink-0 w-32 md:w-48 cursor-pointer transition-all duration-300 ${
            selectedSlice?.id === slice.id ? "bg-gray-100 rounded-lg" : ""
          }`}
          onClick={() => handleClick(slice)}
          onDoubleClick={() => handleDoubleClick(slice)}
        >
          <div className="flex flex-col items-center">
            <ReusableAvatar
              size="lg"
              isCircleCorners
              imageSource={slice.imageUrl}
              imageAlt={slice.name}
            />
            <p
              className={`my-2 text-sm md:text-md ${
                selectedSlice?.id === slice.id ? "font-bold" : ""
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
