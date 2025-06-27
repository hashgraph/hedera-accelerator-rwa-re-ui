"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactWalletsProvider } from "@/services/wallets/ReactWalletsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function Providers({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   // const pathname = usePathname();
   // useEffect(() => {
   //    window.scroll(0, 0);
   // }, [pathname]);

   return (
      <QueryClientProvider client={queryClient}>
         <ReactWalletsProvider>
            <SidebarProvider>{children}</SidebarProvider>
         </ReactWalletsProvider>
      </QueryClientProvider>
   );
}
