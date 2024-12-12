"use client";

import { WalletConnectModal } from "@/components/Wallets/WalletConnectModal";
import { links } from "@/consts/nav";
import type { LinkPages, NavbarLinkEntry } from "@/types/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToggleBarIcon } from "@/resources/icons/ToggleBarIcon";
import { NavbarUserActionsMenu } from "./NavbarUserActionsMenu";

type Props = {
  linksForPage: LinkPages;
  children: React.ReactElement;
};

export const Navbar = ({ linksForPage, children }: Props) => {
  const renderNavbarItem = (link: NavbarLinkEntry, isSidebar = false) => {
    return (
      <Link
        className={`text-xs uppercase py-2 font-bold block ${
          usePathname().endsWith(link.url)
            ? "text-slate-400 hover:text-slate-700"
            : link.title === "+ Building"
            ? "text-red-600 hover:text-red-700"
            : "text-slate-700 hover:text-slate-500"
        }`}
        href={link.url}
        key={link.url}
      >
        <li
          {...(isSidebar && {
            className: "flex flex-row",
          })}
        >
          {isSidebar &&
            (link.icon ? (
              <i
                className={`fas ${
                  link.icon
                } mr-2 text-sm ${
                  usePathname().endsWith(link.url)
                    ? "opacity-75"
                    : "text-slate-400"
                }`}
              />
            ) : (
              <i
                className={`fas ${
                  "fa-ticket"
                } mr-2 text-sm ${
                  usePathname().endsWith(link.url)
                    ? "opacity-75"
                    : "text-slate-400"
                }`}
              />
            ))}
          <span>{link.title}</span>
        </li>
      </Link>
    );
  };

  return (
    <div className="drawer">
      <input id="drawer-toggler" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-lilac w-full">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold px-4 text-gray-700 hover:text-gray-900">
              BUILDINGS "R" US
            </Link>
          </div>
          <div className="flex-none lg:hidden">
            <label
              htmlFor="drawer-toggler"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <ToggleBarIcon />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2" />
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {links[linksForPage]
                .filter((linkEntry) => !linkEntry.hideFromNavbar)
                .map((linkEntry) => renderNavbarItem(linkEntry))}
            </ul>
            <ul className="menu menu-horizontal">
              <NavbarUserActionsMenu />
            </ul>
          </div>
          <WalletConnectModal />
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="drawer-toggler"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-base-200 min-h-full w-80 py-8 px-4">
          {links[linksForPage].map((linkEntry) =>
            renderNavbarItem(linkEntry, true)
          )}
        </ul>
      </div>
    </div>
  );
};
