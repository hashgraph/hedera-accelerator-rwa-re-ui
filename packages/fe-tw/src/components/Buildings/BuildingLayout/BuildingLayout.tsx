"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
   BuildingSidebar,
   PROTECTED_BUILDING_NAV_ITEMS,
} from "@/components/Buildings/BuildingLayout/BuildingSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIdentity } from "@/components/Account/useIdentity";
import path from "path";
import { includes, isBoolean, some } from "lodash";
import { useRouter } from "next/navigation";

type BuildingLayoutProps = {
   children: ReactNode;
   id: string;
};

export default function BuildingLayout({ children, id }: BuildingLayoutProps) {
   const pathname = usePathname();
   const { identityData } = useIdentity();
   const router = useRouter();

   useEffect(() => {
      if (
         identityData.isFetched &&
         !identityData.isDeployed &&
         some(PROTECTED_BUILDING_NAV_ITEMS, ({ href }) => includes(pathname, href))
      ) {
         router.push(`/building/${id}`);
      }
   }, [pathname, identityData.isFetched, identityData.isDeployed, identityData.isLoading]);

   return (
      <div className="flex min-h-screen bg-white">
         <BuildingSidebar />

         <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
            {!identityData.isDeployed &&
            some(PROTECTED_BUILDING_NAV_ITEMS, ({ href }) => includes(pathname, href))
               ? null
               : children}
         </main>
      </div>
   );
}
