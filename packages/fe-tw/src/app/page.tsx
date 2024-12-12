"use client";

import Link from "next/link";
import { ExplorerView } from "@/components/Explorer";

import "./globals.css";

export default function Home() {
    return (
        <>
            <article className="prose my-2">
                <Link href="/dash/featured">
                    <h2>Featured Slices</h2>
                </Link>
            </article>
            <ExplorerView />
        </>
    );
}
