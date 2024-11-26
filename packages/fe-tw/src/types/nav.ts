export interface NavbarLinkEntry {
	title: string;
	url: string;
	icon?: string;
	hideFromNavbar?: boolean;
}

export interface Links {
	admin: NavbarLinkEntry[];
	regularUser: NavbarLinkEntry[];
}

export type LinkPages = "admin" | "regularUser";
