"use client";

import Link from "next/link";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { slugify } from "@/utils/slugify";

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }) {
  return (
    <div className="carousel rounded-box space-x-8 p-2">
      {slices.map((slice) => (
        <div
          key={slice.id}
          className={`carousel-item cursor-pointer ${
            selectedSlice?.id === slice.id ? "bg-gray-100 shadow-md rounded-lg" : ""
          }`}
          onClick={() => onSelectSlice(slice)}
          onDoubleClick={() => {
            // route to detail page on double click
            if (selectedSlice?.id === slice.id) {
              window.location.href = `/slices/${slugify(slice.name)}`;
            }
          }}
        >
          <div className="flex flex-col items-center">
            <ReusableAvatar
              size="lg"
              isCircleCorners
              imageSource={slice.imageUrl}
              imageAlt={slice.name}
            />
            <p className={`my-2 ${selectedSlice?.id === slice.id ? "font-bold" : ""}`}>
              {slice.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
