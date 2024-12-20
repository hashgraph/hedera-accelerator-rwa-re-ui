"use client";

import BuildingNavigation from "@/components/Navbar/BuildingNavigation";
import { type ReactNode, useState } from "react";
import { HiMenu } from "react-icons/hi";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pt-[64px] min-h-screen flex bg-base-100">
      {/* Sidebar */}
      <aside
        className={`
          bg-base-100 z-40 w-[180px]
          transform transition-transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static flex-shrink-0
        `}
      >
        <BuildingNavigation id={id} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Hamburger */}
        <button
          className="md:hidden absolute top-4 left-4 z-50 p-2 rounded bg-primary text-base-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMenu className="w-6 h-6" />
        </button>

        <main className="w-full text-neutral p-0 m-0">{children}</main>
      </div>
    </div>
  );
}
