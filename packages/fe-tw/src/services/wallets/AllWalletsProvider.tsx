"use client";

import { MetamaskContextProvider } from "@/context/MetamaskContext";
import { WalletConnectContextProvider } from "@/context/WalletConnectContext";
import { MetaMaskClient } from "@/services/wallets/metamask/MetaMaskClient";
import { WalletConnectClient } from "@/services/wallets/walletconnect/WalletConnectClient";
import type { ReactNode } from "react";

export const AllWalletsProvider = (props: {
	children: ReactNode | undefined;
}) => {
	return (
		<MetamaskContextProvider>
			<WalletConnectContextProvider>
				<MetaMaskClient />
				<WalletConnectClient />
				{props.children}
			</WalletConnectContextProvider>
		</MetamaskContextProvider>
	);
};
