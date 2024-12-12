"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "@/resources/icons/ArrowLeftIcon";
import { useRouter } from "next/navigation";

export const PageBackButton = () => {
    const { back } = useRouter();

    const prevRouteTitle = "Building Explorer";

    return (
        <Link href="/" className="flex items-center p-4" onClick={() => {
            back();
        }}>
            <ArrowLeftIcon />
            <span className="text-md ml-2 font-bold">{prevRouteTitle}</span>
        </Link>
    );
};
