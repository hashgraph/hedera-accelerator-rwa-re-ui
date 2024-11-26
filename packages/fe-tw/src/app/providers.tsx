"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllWalletsProvider } from "@/services/wallets/AllWalletsProvider";

const queryClient = new QueryClient();

export function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryClientProvider client={queryClient}>
			<AllWalletsProvider>{children}</AllWalletsProvider>
		</QueryClientProvider>
	);
}
