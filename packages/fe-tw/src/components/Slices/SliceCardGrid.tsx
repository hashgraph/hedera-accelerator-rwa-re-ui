"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import moment from "moment";
import { slugify } from "@/utils/slugify";
import { slices } from "@/consts/slices";

type SliceCardGridProps = {
  sliceIds: `0x${string}`[];
};

export default function SliceCardGrid({ sliceIds }: SliceCardGridProps) {
  const pathname = usePathname();
  const buildingId = pathname.split("/")[2];

  const relevantSlices = slices.filter((slice) =>
    sliceIds.includes(slice.id)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {relevantSlices.map((slice) => (
        <Link
          key={slice.id}
          href={`/building/${buildingId}/slices/${slugify(slice.name)}`}
          className="cursor-pointer"
        >
          <div
            className="
              bg-accent text-gray-800 rounded-lg p-4 
              transition-transform duration-300 
              hover:scale-[1.02] hover:bg-accent-dark flex flex-col 
              h-[430px]
            "
          >
            <img
              src={slice.imageIpfsUrl ?? "assets/dome.jpeg"}
              alt={slice.name}
              className="rounded-md object-cover w-full h-40 mb-3"
            />

            <div className="flex flex-col flex-1">
              <h3 className="text-md font-semibold truncate mb-1">
                {slice.name}
              </h3>

              {typeof slice.allocation === "number" && (
                <>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Allocations:</span> {slice.allocation}%
                  </p>
                  <div className="my-2"></div> {/* Line break */}
                </>
              )}

              <p className="text-sm text-gray-800 mb-2 line-clamp-3 overflow-hidden">
                {slice.description}
              </p>

              {slice.estimatedPrice && (
                <p className="text-xs text-gray-800 mt-auto">
                  Estimated Price: ${slice.estimatedPrice}
                </p>
              )}

              <p className="text-xs text-gray-600 mt-1">
                Time to End: {moment(slice.endDate).fromNow()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
