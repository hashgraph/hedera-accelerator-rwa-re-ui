"use client";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { zeniq } from "viem/chains";

export function SingleSliceView({ sliceName, buildings }) {
  return (
    <>
      <Link href={`/slices/${slugify(sliceName)}`}>
        <h2 className="text-xl font-bold mt-8 cursor-pointer">
          {sliceName} Slice →
        </h2>
      </Link>
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
              {/* Remove the description line if you don't want it */}
            </div>
          </Link>
        ))}
        {buildings.length === 0 && (
          <p className="text-sm text-gray-500">
            No buildings found for {sliceName} slice.
          </p>
        )}
      </div>
    </>
  );
}