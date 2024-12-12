"use client";

import Link from "next/link";
import { PlayButton } from "@/components/Buttons/PlayButton";

export function FeaturedDevelopments({ selectedSliceName, developments }) {
  return (
    <>
      <Link href="/dash/featured">
        <h2 className="text-xl font-bold cursor-pointer">
          Featured upcoming developments in {selectedSliceName} →
        </h2>
      </Link>
      <div className="flex flex-row gap-6 mt-4">
        {developments.map((development) => (
          <div
            key={development.id}
            className="relative bg-white rounded-lg w-84 h-64 flex-shrink-0 overflow-hidden"
          >
            <img
              src={development.imageUrl ?? "/default-building.jpg"}
              alt={development.title}
              className="object-cover w-full h-44 rounded-lg"
            />

            <div className="p-3">
              <h3 className="text-base font-semibold truncate">{development.title}</h3>
              <p className="text-sm text-gray-600">
                Est price: ${development.estimatedPrice}
                <span className="ml-2">{development.daysLeft} days left</span>
              </p>
            </div>

            <PlayButton href={`/building/${development.id}`} />
          </div>
        ))}
        {developments.length === 0 && (
          <p className="text-sm text-gray-500">
            No upcoming developments found for {selectedSliceName}.
          </p>
        )}
      </div>
    </>
  );
}
