"use client";

import { ReactNode, use, useState } from "react";
import BuildingNavigation from "@/components/Navbar/BuildingNavigation";
import { HiMenu } from "react-icons/hi";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }> | { id: string };
};

export default function Layout({ children, params }: LayoutProps) {
  const resolvedParams = "then" in params ? use(params) : params;
  const { id } = resolvedParams;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-md transition-transform transform z-40 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <BuildingNavigation id={id} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-[240px]">
        {/* Hamburger for Small Screens */}
        <button
          className="md:hidden absolute top-4 left-4 z-50 p-2 rounded bg-white shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <HiMenu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Main Content */}
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
