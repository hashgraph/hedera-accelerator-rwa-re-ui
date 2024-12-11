import { useState } from "react";
import { buildingSlices, buildings } from "@/consts/props";
import { FeaturedSlice } from "./FeaturedSlice";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export const FeaturedSlices = () => {
    const [selectedSlice, setSelectedSlice] = useState(null);

    const handleSliceClick = (slice) => {
        setSelectedSlice(slice);
    };

    const filteredBuildings = selectedSlice
        ? buildings.filter((building) => building.partOfSlices.includes(selectedSlice.id))
        : [];

    return (
        <div className="my-2">
            <div className="flex items-center justify-between mb-4">
                <Link href="/slices">
                    <p className="text-2xs font-bold cursor-pointer">Click here for all slices</p>
                </Link>
            </div>
            <div className="carousel rounded-box space-x-8 p-2">
                {buildingSlices.map((slice) => (
                    <div
                        key={slice.name}
                        className="carousel-item cursor-pointer"
                        onClick={() => handleSliceClick(slice)}
                    >
                        <FeaturedSlice {...slice} />
                    </div>
                ))}
            </div>
            {selectedSlice && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">
                        Featured Development in {selectedSlice.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {filteredBuildings.map((building) => (
                            <div key={building.id} className="p-4 border rounded shadow">
                                <h3 className="text-lg font-semibold">{building.title}</h3>
                                <p className="text-sm text-gray-600 mt-2">{building.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};