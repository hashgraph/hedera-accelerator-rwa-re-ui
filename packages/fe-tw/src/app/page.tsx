"use client";

import Link from "next/link";
import type React from "react";

import { FeaturedSlices } from "@/components/FeaturedSlices";
import { FeaturedSliceCategory } from "@/components/FeaturedSlices/FeaturedSliceCategory";
import { buildingSliceCategories } from "@/consts/props";

export default function Home() {
	return (
		<>
			<article className="prose my-2">
				<Link href="/dash/featured">
					<h2>Featured Slices</h2>
				</Link>
			</article>
			<FeaturedSlices />
			{buildingSliceCategories.map((category) => (
				<FeaturedSliceCategory key={category.name} {...category} />
			))}
		</>
	);
}
