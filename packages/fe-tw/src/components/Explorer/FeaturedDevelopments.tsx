"use client";

import { PlayButton } from "@/components/Buttons/PlayButton";
import Link from "next/link";

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

export function FeaturedDevelopments({
  selectedSliceName,
  developments,
}: FeaturedDevelopmentsProps) {
  return (
    <>
      <Link href="/dash/featured">
        <h2 className="text-xl font-bold cursor-pointer">
          Featured upcoming developments in {selectedSliceName} →
        </h2>
      </Link>
      <div className="flex overflow-x-auto space-x-4 mt-6 p-2">
        {developments.map((development) => (
          <div
            key={development.id}
            className="card card-compact bg-base-100 w-64 md:w-80 shadow-md flex-shrink-0"
          >
            <figure>
              <img
                src={development.imageUrl ?? "assets/dome.jpeg"}
                alt={development.title}
                className="object-cover w-full h-36 md:h-48"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title truncate">{development.title}</h3>
              <p className="text-sm text-gray-600">
                Est price: ${development.estimatedPrice}
              </p>
              <p className="text-sm text-gray-600">
                {development.daysLeft} days left
              </p>
              <div className="card-actions justify-end">
                <PlayButton href={`/building/${development.id}`} />
              </div>
            </div>
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
