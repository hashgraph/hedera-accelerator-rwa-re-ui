import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";

import { SlicesOverview } from "@/components/Slices/SlicesOverview";
import { FeaturedSlices } from "@/components/FeaturedSlices";
import { FeaturedSliceCategory } from "@/components/FeaturedSlices/FeaturedSliceCategory";
import { buildingSliceCategories } from "@/consts/props";

import "./globals.css";


export const metadata: Metadata = {
	title: "B.R.U",
	description: 'Building "R" US - Explorer',
};

export default function Home() {
	return (
        <>
           <article className="prose my-2">
                <Link href="/dash/featured">
                    <h2>Featured Slices</h2>
                </Link>
            </article>
            <FeaturedSlices />
            {buildingSliceCategories.map(category => (
                <FeaturedSliceCategory key={category.name} {...category} />
            ))}
            <SlicesOverview /> 
        </>
	);
}
