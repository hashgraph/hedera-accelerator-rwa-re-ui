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
    <div className="carousel rounded-box space-x-8 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`carousel-item cursor-pointer transition-all duration-300 ${
            selectedSlice?.id === slice.id ? "bg-gray-100 rounded-lg" : ""
          }`}
          onClick={() => handleClick(slice)}
          onDoubleClick={() => handleDoubleClick(slice)}
        >
          <div className="flex flex-col items-center">
            <div>
              <ReusableAvatar
                size="lg"
                isCircleCorners
                imageSource={slice.imageUrl}
                imageAlt={slice.name}
              />
            </div>
            <p className={`my-2 ${selectedSlice?.id === slice.id ? "font-bold" : ""}`}>
              {slice.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
