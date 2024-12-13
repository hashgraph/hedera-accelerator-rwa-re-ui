"use client";

import Link from "next/link";
import { ExplorerView } from "@/components/Explorer";

import "./globals.css";

export default function Home() {
    return (
        <div className="pt-8 px-12"> 
            <Link href="/slices">
                <h2 className="text-xl font-bold cursor-pointer mb-6">
                    Featured Slices →
                </h2>
            </Link>
            <ExplorerView />
        </div>
    );
}
