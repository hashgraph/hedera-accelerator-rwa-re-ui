"use client";

import { useBuildings } from "@/hooks/useBuildings";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

export function BuildingsOverview() {
  const { buildings } = useBuildings();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="breadcrumbs text-sm text-gray-700 mb-4">
        <ul>
          <li>
            <Link
              href="/explorer"
              className="flex items-center text-purple-800 hover:underline"
            >
              <ArrowBack fontSize="small" />
              <span className="ml-2">Explorer</span>
            </Link>
          </li>
          <li>
            <span className="font-semibold">Buildings</span>
          </li>
        </ul>
      </div>
      <div className="bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Buildings Catalogue
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mb-4">
          Explore the buildings in our ecosystem. Each building is tokenized and
          forms part of the investment opportunities in the platform.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {buildings.map((building) => (
          <Link key={building.id} href={`/building/${building.id}`}>
            <div
              className="
                bg-white border border-gray-300 rounded-lg p-4 shadow-md
                transition-transform duration-200 hover:scale-[1.02] cursor-pointer
                flex flex-col items-center
                h-64 w-full overflow-scroll
              "
            >
              <img
                src={building.imageUrl ?? "assets/dome.jpeg"}
                alt={building.title}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-center">
                {building.title}
              </h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                {building.description ?? "No description available"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
