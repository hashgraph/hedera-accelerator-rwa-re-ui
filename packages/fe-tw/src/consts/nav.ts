import type { Links } from "@/types/nav";

export const links: Links = {
	admin: [
		{
			title: "+ Building",
			url: "/buildings/add",
			icon: "fa-plus",
			hideFromNavbar: true,
		},
		{ title: "Explorer", url: "/", icon: "fa-tv" },
		{ title: "Portfolio", url: "/dash/portfolio", icon: "fa-tools" },
		{ title: "Upcoming", url: "/dash/upcoming", icon: "fa-table" },
		{ title: "Govern", url: "/dash/govern", icon: "fa-map-marked" },
	],
	regularUser: [
		{ title: "Landing", url: "/landing", icon: "fa-newspaper" },
		{ title: "Explorer", url: "/", icon: "fa-tv" },
		{ title: "Portfolio", url: "/dash/settings", icon: "fa-tools" },
		{ title: "Upcoming", url: "/dash/tables", icon: "fa-table" },
		{ title: "Govern", url: "/dash/maps", icon: "fa-map-marked" },
	],
};
