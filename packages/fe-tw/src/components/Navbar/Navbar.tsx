"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { WalletConnectModalRW } from "@/components/Wallets/WalletConnectModalRW";
import { NavbarUserActionsMenu } from "@/components/Navbar/NavbarUserActionsMenu";

const SITE_LINKS = [
  { title: "FAQ", url: "/faq" },
  { title: "Admin", url: "/admin" },
];

export function Navbar({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const explorerDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const detailsEl = explorerDetailsRef.current;
      if (detailsEl && detailsEl.hasAttribute("open")) {
        if (!detailsEl.contains(event.target as Node)) {
          detailsEl.removeAttribute("open");
        }
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="navbar bg-accent w-full px-4 py-2 relative z-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex-none">
            <Link
              href="/explorer"
              className="text-lg font-bold text-gray-700 hover:text-gray-900"
            >
              BUILDINGS "R" US
            </Link>
          </div>

          {/* Hamburger Menu (mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-square btn-ghost"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6 pr-4">
            <details ref={explorerDetailsRef} className="group relative">
              <summary
                className="
                  uppercase font-bold text-sm text-gray-700 hover:text-gray-900 
                  list-none cursor-pointer flex items-center
                "
              >
                Explorer

                <svg
                  className="ml-1 w-4 h-4 text-gray-600 group-hover:text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.0l3.71-3.78a.75.75 0 011.08 1.04l-4.25 4.33a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                </svg>
              </summary>

              <ul
                className="
                  menu p-2 bg-white text-black rounded absolute
                  top-full left-0 mt-2 w-48
                  opacity-0 pointer-events-none
                  group-open:opacity-100 group-open:pointer-events-auto
                  transition-all
                "
              >
                <li>
                  <Link href="/explorer">Featured</Link>
                </li>
                <li>
                  <Link href="/building">Buildings</Link>
                </li>
                <li>
                  <Link href="/slices">Slices</Link>
                </li>
              </ul>
            </details>

            {SITE_LINKS.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="uppercase font-bold text-sm text-gray-700 hover:text-gray-900"
              >
                {link.title}
              </Link>
            ))}

            <NavbarUserActionsMenu />
            <WalletConnectModalRW />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2 px-4 space-y-4">
          <div className="flex flex-col gap-3">
            <details>
              <summary className="uppercase font-bold text-sm text-gray-700 hover:text-gray-900">
                Explorer
              </summary>
              <ul className="pl-4 mt-1 space-y-1 text-black">
                <li>
                  <Link href="/explorer">Explorer Home</Link>
                </li>
                <li>
                  <Link href="/building">Buildings</Link>
                </li>
                <li>
                  <Link href="/slices">Slices</Link>
                </li>
              </ul>
            </details>

            {SITE_LINKS.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-gray-700 hover:text-gray-900"
              >
                {link.title}
              </Link>
            ))}

            <NavbarUserActionsMenu />
            <WalletConnectModalRW />
          </div>
        </div>
      )}

      <main className="flex-1 bg-base-100 w-full">{children}</main>
    </div>
  );
}
