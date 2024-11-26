import type { Metadata } from "next";
import "../globals.css";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import HeaderStats from "@/components/Headers/HeaderStats";
import FENavbar from "@/components/Navbar/FENavbar";

import type React from "react";

export const metadata: Metadata = {
	title: "B.R.U",
	description: "Generated with love",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<FENavbar linksForPage="admin" title="">
				<div className="relative bg-slate-100">
					<HeaderStats />
					<div className="px-4 md:px-10 mx-auto w-full -m-24">{children}</div>
				</div>
			</FENavbar>
			<FooterAdmin />
		</>
	);
}
