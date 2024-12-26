"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "@/resources/icons/ArrowLeftIcon";

type PageBackButtonProps = {
    to?: string;
    label?: string;
};

export const PageBackButton = ({ to = "/explorer", label = "Back" }: PageBackButtonProps) => {
    return (
        <Link href={to} className="flex items-center p-4 text-purple-700 hover:text-purple-900">
            <ArrowLeftIcon />
            <span className="text-md ml-2 font-bold">{label}</span>
        </Link>
    );
};
