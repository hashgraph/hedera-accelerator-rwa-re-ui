"use client";

import { MetamaskContext } from "@/context/MetamaskContext";
import { WalletConnectContext } from "@/context/WalletConnectContext";
import { metamaskWallet } from "@/services/wallets/metamask/MetaMaskClient";
import { walletConnectWallet } from "@/services/wallets/walletconnect/WalletConnectClient";
import { useContext } from "react";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
export const useWalletInterface = () => {
	const metamaskCtx = useContext(MetamaskContext);
	const walletConnectCtx = useContext(WalletConnectContext);

	if (metamaskCtx.metamaskAccountAddress) {
		return {
			accountId: metamaskCtx.metamaskAccountAddress,
			accountEvmAddress: metamaskCtx.metamaskAccountAddress,
			walletInterface: metamaskWallet,
		};
	}

	if (walletConnectCtx.accountId) {
		return {
			accountId: walletConnectCtx.accountId,
			accountEvmAddress: walletConnectCtx.accountEvmAddress,
			walletInterface: walletConnectWallet,
		};
	}

	return {
		accountId: null,
		walletInterface: null,
		accountEvmAddress: null,
	};
};
