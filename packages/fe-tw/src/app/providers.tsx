"use client";

import { AllWalletsProvider } from "@/services/wallets/AllWalletsProvider";
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
			<AllWalletsProvider>{children}</AllWalletsProvider>
		</QueryClientProvider>
	);
}