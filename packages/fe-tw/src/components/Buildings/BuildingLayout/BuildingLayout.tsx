"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BuildingSidebar } from "@/components/Buildings/BuildingLayout/BuildingSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type BuildingLayoutProps = {
   children: ReactNode;
   id: string;
};

const BUILDING_NAV_ITEMS = [
   { name: "Overview", href: "" },
   { name: "Staking", href: "staking" },
   { name: "Proposals", href: "proposals" },
   { name: "Slices", href: "slices" },
   { name: "Payments", href: "payments" },
   { name: "Expenses", href: "expenses" },
   { name: "COPE", href: "cope" },
   { name: "Mint", href: "mint" },
   { name: "Trade", href: "trade" },
];

export default function BuildingLayout({ children, id }: BuildingLayoutProps) {
   return (
      <div className="flex min-h-screen bg-white">
         <BuildingSidebar />

         <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
            {children}
         </main>
      </div>
   );
}
