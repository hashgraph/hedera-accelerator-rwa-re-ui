"use client";

import { ReactWalletsProvider } from "@/services/wallets/ReactWalletsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

const queryClient = new QueryClient();

export function Providers({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <QueryClientProvider client={queryClient}>
         <ReactWalletsProvider>{children}</ReactWalletsProvider>
      </QueryClientProvider>
   );
}
