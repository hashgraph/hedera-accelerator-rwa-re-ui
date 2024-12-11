"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }) {
  return (
    <div className="carousel rounded-box space-x-8 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`carousel-item cursor-pointer ${selectedSlice.id === slice.id ? "bg-gray-200 rounded" : ""}`}
          onClick={() => onSelectSlice(slice)}
        >
          <div className="flex flex-col items-center">
            <ReusableAvatar
              size="lg"
              isCircleCorners
              imageSource={slice.imageUrl}
              imageAlt={slice.name}
            />
            <p className="my-2">{slice.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
