"use client";

import { useState } from "react";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }) {
  const [hoveredSliceId, setHoveredSliceId] = useState(null);

  return (
    <div className="carousel rounded-box space-x-8 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`carousel-item cursor-pointer ${
            selectedSlice.id === slice.id ? "bg-gray-100 shadow-md rounded-lg" : ""
          }`}
          onClick={() => onSelectSlice(slice)}
          onMouseEnter={() => setHoveredSliceId(slice.id)}
          onMouseLeave={() => setHoveredSliceId(null)}
        >
          <div className="flex flex-col items-center">
            <ReusableAvatar
              size="lg"
              isCircleCorners
              imageSource={slice.imageUrl}
              imageAlt={slice.name}
              onFocusStateChange={(state) => setHoveredSliceId(state ? slice.id : null)}
            />
            <p
              className={`my-2 transition-transform ${
                selectedSlice.id === slice.id ? "font-bold" : ""
              }`}
            >
              {slice.name}
            </p>
          </div>
        </div>
      ))}
      <style jsx>{`
        .carousel-item img {
          transition: transform 0.3s ease-in-out;
        }
        .carousel-item:hover img {
          transform: scale(1.1); /* Enlarge slightly on hover */
        }
        .carousel-item img {
          transform: ${hoveredSliceId === selectedSlice.id || selectedSlice.id === hoveredSliceId
            ? "scale(1.1)"
            : "scale(1)"};
        }
      `}</style>
    </div>
  );
}
