"use client";

import { slugify } from "@/utils/slugify";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useSlicesData } from "@/hooks/useSlicesData";

type SliceCardGridProps = {
   sliceIds: `0x${string}`[];
};

export default function SliceCardGrid({ sliceIds }: SliceCardGridProps) {
   const pathname = usePathname();
   const buildingId = pathname.split("/")[2];
   const { slices } = useSlicesData();

   const relevantSlices = slices.filter((slice) => sliceIds.includes(slice.id));

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
         {relevantSlices.map((slice) => (
            <Card
               key={slice.id}
               className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer p-0 pb-6 gap-2"
            >
               <Link href={`/slices/${slice.id}`} className="cursor-pointer">
                  <>
                     <img
                        src={slice.imageIpfsUrl ?? "assets/dome.jpeg"}
                        alt={slice.name}
                        className="w-full h-32 object-cover rounded-t-md mb-3 top-0"
                     />

                     <CardContent className="flex flex-col flex-1">
                        <h3 className="text-md font-semibold truncate mb-1">{slice.name}</h3>

                        {typeof slice.allocation === "number" && (
                           <>
                              <p className="text-sm text-gray-700">
                                 <span className="font-medium">Allocations:</span>{" "}
                                 {slice.allocation}%
                              </p>
                              <div className="my-2" /> {/* Line break */}
                           </>
                        )}

                        <p className="text-sm text-gray-800 mb-2 line-clamp-3 overflow-hidden">
                           {slice.description}
                        </p>

                        {slice.estimatedPrice !== 0 && (
                           <p className="text-xs text-gray-800 mt-auto">
                              Estimated Price: ${slice.estimatedPrice}
                           </p>
                        )}
                     </CardContent>
                  </>
               </Link>
            </Card>
         ))}
      </div>
   );
}
