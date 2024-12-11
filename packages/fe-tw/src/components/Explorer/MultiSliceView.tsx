"use client";

import Link from "next/link";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";

export function MultiSliceView({ sliceName, randomSliceName, buildings }) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-8">
        {sliceName} + {randomSliceName} Slice
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {buildings.map((bld) => (
          <Link key={bld.id} href={`/building/${bld.id}`}>
            <div className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100 transition">
              <ReusableAvatar
                size="md"
                isRounded
                imageAlt={bld.title}
                imageSource={bld.imageUrl ?? "/default-building.jpg"}
              />
              <h3 className="text-lg font-semibold mt-2">{bld.title}</h3>
              {/* Description removed */}
            </div>
          </Link>
        ))}
        {buildings.length === 0 && (
          <p className="text-sm text-gray-500">
            No buildings found that match both {sliceName} and {randomSliceName}.
          </p>
        )}
      </div>
    </>
  );
}
