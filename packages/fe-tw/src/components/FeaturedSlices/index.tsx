"use client";

import { buildingSlices } from "@/consts/props";
import { FeaturedSlice } from "./FeaturedSlice";

export const FeaturedSlices = () => {
	return (
		<div className="carousel rounded-box space-x-8 my-2 p-2">
			{buildingSlices.map((slice) => (
				<div key={slice.name} className="carousel-item">
					<FeaturedSlice {...slice} />
				</div>
			))}
		</div>
	);
};
