"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
  { name: "Trade", href: "trade" },
];

export default function BuildingLayout({ children, id }: BuildingLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <nav className="space-y-2">
          {BUILDING_NAV_ITEMS.map((item) => {
            const linkTo = `/building/${id}/${item.href}`;
            const isActive = pathname === linkTo || pathname === `${linkTo}/`;

            return (
              <Link
                key={item.name}
                href={linkTo}
                className={`block px-4 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-gray-100 text-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
        {children}
      </main>
    </div>
  );
}
