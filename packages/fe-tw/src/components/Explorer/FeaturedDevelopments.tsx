"use client";

import Link from "next/link";
import { PlayButton } from "@/components/Buttons/PlayButton";

type Development = {
  id: number;
  title: string;
  estimatedPrice: number;
  daysLeft: number;
  imageUrl?: string;
};

type FeaturedDevelopmentsProps = {
  selectedSliceName: string;
  developments: Development[];
};

export function FeaturedDevelopments({ selectedSliceName, developments }: FeaturedDevelopmentsProps) {
  return (
    <>
      <Link href="/dash/featured">
        <h2 className="text-xl font-bold cursor-pointer">
          Featured upcoming developments in {selectedSliceName} →
        </h2>
      </Link>
      <div className="flex flex-row gap-8 mt-6">
        {developments.map((development) => (
          <div
            key={development.id}
            className="relative bg-white rounded-2xl w-96 h-72 flex-shrink-0 overflow-hidden shadow-sm"
          >
            <img
              src={development.imageUrl ?? "/default-building.jpg"}
              alt={development.title}
              className="object-cover w-full h-48"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{development.title}</h3>
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
