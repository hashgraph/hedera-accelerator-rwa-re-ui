"use client";

import { useContext } from "react";
import { WalletConnectContext } from "@/context/WalletConnectContext";
import { walletConnectWallet } from "@/services/wallets/walletconnect/WalletConnectClient";
import { MetamaskContext } from "@/context/MetamaskContext";
import { metamaskWallet } from "@/services/wallets/metamask/MetaMaskClient";

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
	} else if (walletConnectCtx.accountId) {
		return {
			accountId: walletConnectCtx.accountId,
			accountEvmAddress: walletConnectCtx.accountEvmAddress,
			walletInterface: walletConnectWallet,
		};
	} else {
		return {
			accountId: null,
			walletInterface: null,
			accountEvmAddress: null,
		};
	}
};
