"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SliceData } from "@/types/erc3643/types";
import { slugify } from "@/utils/slugify";
import { isValidIPFSImageUrl } from "@/utils/helpers";

interface Props {
  slices: SliceData[];
  selectedSlice?: SliceData;
  onSelectSlice: (slice: SliceData) => void;
}

export function SlicesCarousel({ slices, selectedSlice, onSelectSlice }: Props) {
  const handleClick = useCallback(
    (slice: SliceData) => {
      onSelectSlice(slice);
    },
    [onSelectSlice],
  );

  const handleDoubleClick = useCallback(
    (slice: SliceData) => {
      if (selectedSlice?.id === slice.id) {
        window.location.href = `/slices/${slugify(slice.name)}`;
      }
    },
    [selectedSlice],
  );

  return (
    <Carousel>
      <CarouselContent className="p-4">
        {slices.map((slice) => (
          <CarouselItem
            key={slice.address}
            onClick={() => handleClick(slice)}
            onDoubleClick={() => handleDoubleClick(slice)}
            className="hover:scale-105 hover:bg-accent-focus transition-all duration-300 basis-1/4"
          >
            <div className="p-1">
              <Card className="flex flex-auto">
                <CardContent className="flex flex-auto items justify-center">
                  <Link href={`/slices/${slice.id}`} className="cursor-pointer">
                    <img
                      src={isValidIPFSImageUrl(slice.imageIpfsUrl) ? slice.imageIpfsUrl : "/assets/dome.jpeg"}
                      alt={slice.name}
                      className="rounded-md object-cover w-full h-40 mb-2"
                    />
                    <h3 className="text-sm font-semibold text-center truncate">
                      {slice.name}
                    </h3>
                    {typeof slice.allocation === "number" && (
                      <p className="text-xs text-gray-700">
                        {slice.allocation}% Allocation
                      </p>
                    )}
                    </Link>
                  </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}