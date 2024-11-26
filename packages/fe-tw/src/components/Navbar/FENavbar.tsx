"use client";

import Link from "next/link";
import { links } from "@/consts/nav";
import type { LinkPages, NavbarLinkEntry } from "@/types/nav";
import { usePathname } from "next/navigation";
import { FENavbarUserActionsMenu } from "./FENavbarUserActionsMenu";

type Props = {
	linksForPage: LinkPages;
	title: string;
	children: React.ReactElement;
};

const FENavbarTogglerIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		className="inline-block h-6 w-6 stroke-current"
	>
		<title> </title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</svg>
);

export default function FENavbar({ linksForPage, children }: Props) {
	const renderNavbarItem = (link: NavbarLinkEntry, isSidebar = false) => {
		return (
			<Link
				className={`text-xs uppercase py-2 font-bold block ${
					usePathname().endsWith(link.url)
						? "text-lightBlue-500 hover:text-lightBlue-600"
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
								className={`fas ${link.icon} mr-2 text-sm ${
									usePathname().endsWith(link.url)
										? "opacity-75"
										: "text-slate-400"
								}`}
							/>
						) : (
							<i
								className={`fas fa-ticket mr-2 text-sm ${
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
				<div className="navbar bg-base-300 w-full">
					<div className="flex-none lg:hidden">
						<label
							htmlFor="drawer-toggler"
							aria-label="open sidebar"
							className="btn btn-square btn-ghost"
						>
							{FENavbarTogglerIcon}
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
							<FENavbarUserActionsMenu />
						</ul>
					</div>
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
						renderNavbarItem(linkEntry, true),
					)}
				</ul>
			</div>
		</div>
	);
}
