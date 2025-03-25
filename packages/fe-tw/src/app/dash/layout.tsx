import type { Metadata } from "next";
import "../globals.css";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import HeaderStats from "@/components/Headers/HeaderStats";
import { Navbar } from "@/components/Navbar/Navbar";

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
         <Navbar />
         <main className="flex-1 bg-base-100 w-full">
            <div className="relative bg-slate-100">
               <HeaderStats />
               <div className="px-4 md:px-10 mx-auto w-full -m-24">{children}</div>
            </div>
         </main>

         <FooterAdmin />
      </>
   );
}
