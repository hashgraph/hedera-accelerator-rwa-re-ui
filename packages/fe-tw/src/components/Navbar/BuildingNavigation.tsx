"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { PageBackButton } from "@/components/Page/PageBackButton";

const NAV_ITEMS = [
  { name: "Overview", href: "" },
  { name: "Staking", href: "staking" },
  { name: "Proposals", href: "proposals" },
  { name: "Slices", href: "slices" },
  { name: "Payments", href: "payments" },
  { name: "Expenses", href: "expenses" },
  { name: "COPE", href: "cope" },
  { name: "Trade", href: "trade" },
  { name: "Admin", href: "admin" },
];

export default function BuildingNavigation({ id }: { id: string }) {
  const segments = useSelectedLayoutSegments();
  const activeSegment = segments[0] || "";

  return (
    <nav className="flex flex-col space-y-2 min-w-[140px] bg-white h-full shadow-md">
      <div className="mb-4">
        <PageBackButton to="/explorer" label="Back" />
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = activeSegment === item.href;
        return (
          <Link
            key={item.name}
            href={`/building/${id}/${item.href}`}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
