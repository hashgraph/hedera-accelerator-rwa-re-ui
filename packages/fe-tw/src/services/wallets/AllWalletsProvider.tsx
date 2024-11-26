"use client";

import type { ReactNode } from "react";
import { WalletConnectClient } from "@/services/wallets/walletconnect/WalletConnectClient";
import { WalletConnectContextProvider } from "@/context/WalletConnectContext";
import { MetamaskContextProvider } from "@/context/MetamaskContext";
import { MetaMaskClient } from "@/services/wallets/metamask/MetaMaskClient";

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
