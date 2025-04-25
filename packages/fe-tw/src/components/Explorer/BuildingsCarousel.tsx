"use client";

import type { BuildingData } from "@/types/erc3643/types";
import Link from "next/link";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { isValidIPFSImageUrl } from "@/utils/helpers";

type Props = {
   title?: string;
   buildings: BuildingData[];
};

export function BuildingsCarousel({ title, buildings }: Props) {
   return (
      <div>
         {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

         <Carousel>
            <CarouselContent className="p-4">
               {buildings.map((bld) => (
                  <CarouselItem
                     key={bld.id}
                     className="hover:scale-105 hover:bg-accent-focus transition-all duration-300 basis-1/4"
                  >
                     <Card>
                        <CardContent>
                           <Link href={`/building/${bld.id}`} className="cursor-pointer">
                              <img
                                 src={isValidIPFSImageUrl(bld.imageUrl) ? bld.imageUrl : "assets/dome.jpeg"}
                                 alt={bld.title}
                                 className="rounded-md object-cover w-full h-40 mb-2"
                              />
                              <h3 className="text-sm font-semibold text-center truncate">
                                 {bld.title}
                              </h3>
                              {typeof bld.allocation === "number" && (
                                 <p className="text-xs text-gray-700">
                                    {bld.allocation}% Allocation
                                 </p>
                              )}
                           </Link>
                        </CardContent>
                     </Card>
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
         </Carousel>
      </div>
   );
}
