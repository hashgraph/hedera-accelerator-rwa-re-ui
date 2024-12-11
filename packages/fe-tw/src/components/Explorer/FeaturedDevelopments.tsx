"use client";

import Link from "next/link";
import { FeaturedSliceCategoryItem } from "@/components/FeaturedSlices/FeaturedSliceCategory/FeaturedSliceCategoryItem";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";

export function FeaturedDevelopments({ selectedSliceName, developments }) {
  return (
    <>
      <Link href="/dash/featured">
        <h2 className="text-xl font-bold cursor-pointer">
          Featured upcoming Development in {selectedSliceName} →
        </h2>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {developments.map((development) => (
          <Link key={development.id} href={`/building/${development.id}`}>
            <div className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100 transition">
              <ReusableAvatar
                size="md"
                isRounded
                imageAlt={development.title}
                imageSource={development.imageUrl ?? "/default-building.jpg"}
              />
              <h3 className="text-lg font-semibold mt-2">{development.title}</h3>
              {/* No description here either */}
            </div>
          </Link>
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
