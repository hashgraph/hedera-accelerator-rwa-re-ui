"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildingSlices } from "@/consts/props";
import { getSliceTokens, getBuildingForToken } from "@/services/mockSliceService";
import { slugify } from "@/utils/slugify";

type TokenWithBuilding = {
  tokenAddress: string;
  idealAllocation: string;
  actualAllocation: string;
  building: {
    nftId: number;
    name: string;
    image: string;
    location: string;
  };
};

type SliceWithBuildings = {
  slice: typeof buildingSlices[number];
  tokensWithBuilding: TokenWithBuilding[];
};

export function SlicesOverview() {
  const [slicesWithBuildings, setSlicesWithBuildings] = useState<SliceWithBuildings[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await Promise.all(
        buildingSlices.map(async (slice) => {
          const tokens = await getSliceTokens(slice.name);
          const tokensWithBuilding = await Promise.all(
            tokens.map(async (token) => {
              const building = await getBuildingForToken(token.tokenAddress);
              return { ...token, building };
            })
          );
          return { slice, tokensWithBuilding };
        })
      );
      setSlicesWithBuildings(data);
    })();
  }, []);

  if (slicesWithBuildings === null) {
    return <div className="p-6">Loading slices...</div>;
  }

  return (
    <div className="p-6">
      {slicesWithBuildings.map(({ slice, tokensWithBuilding }) => (
        <div key={slice.name} className="mb-10">
          <article className="prose my-2">
            <Link href={`/slices/${slugify(slice.name)}`}>
              <h2 className="text-stone-700">{slice.name} Slice</h2>
            </Link>
          </article>
          <div className="flex flex-row space-x-8">
            {tokensWithBuilding.map((item) => (
              <Link key={item.tokenAddress} href={`/slices/${slugify(slice.name)}`}>
                <div className="cursor-pointer text-center">
                  <img
                    src={item.building.image}
                    alt={item.building.name}
                    className="w-32 h-32 rounded-full object-cover shadow"
                  />
                  <p className="text-sm mt-2">{item.building.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
