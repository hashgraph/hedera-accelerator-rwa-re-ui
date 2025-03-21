"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { title: "Dashboard", href: "/admin" },
  { title: "Token Management", href: "/admin/tokenmanagement" },
  { title: "Building Management", href: "/admin/buildingmanagement" },
  { title: "Slice Management", href: "/admin/slicemanagement" },
  { title: "Audit Management", href: "/admin/auditmanagement" },
];

export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <nav className="space-y-2">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
        {children}
      </main>
    </div>
  );
}
