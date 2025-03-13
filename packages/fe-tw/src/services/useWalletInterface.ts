"use client";

import { MetamaskContext } from "@/context/MetamaskContext";
import { WalletConnectContext } from "@/context/WalletConnectContext";
import type { WalletInterface } from "@/services/wallets/WalletInterface";
import { metamaskWallet } from "@/services/wallets/metamask/MetaMaskClient";
import { walletConnectWallet } from "@/services/wallets/walletconnect/WalletConnectClient";
import { useContext } from "react";

export interface UseWalletInterfaceResult {
  accountId: string | null;
  accountEvmAddress: string | null;
  walletInterface: WalletInterface | null;
}

export function useWalletInterface(): UseWalletInterfaceResult {
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
      walletInterface: walletConnectWallet, // implements WalletInterface
    };
  }

  return {
    accountId: null,
    accountEvmAddress: null,
    walletInterface: null,
  };
}
