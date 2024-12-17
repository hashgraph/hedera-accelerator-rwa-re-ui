"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

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
    <div className="tabs">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSegment === item.href;
        return (
          <Link
            key={item.name}
            href={`/building/${id}/${item.href}`}
            className={`tab tab-bordered ${isActive ? "tab-active" : ""}`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
