"use client";

import { createContext, useState, type ReactNode } from "react";

const defaultValue = {
	accountId: "",
	setAccountId: (newValue: string) => {},
	isConnected: false,
	setIsConnected: (newValue: boolean) => {},
	accountEvmAddress: "",
	setAccountEvmAddress: (newValue: string) => {},
};

export const WalletConnectContext = createContext(defaultValue);

export const WalletConnectContextProvider = (props: {
	children: ReactNode | undefined;
}) => {
	const [accountId, setAccountId] = useState(defaultValue.accountId);
	const [isConnected, setIsConnected] = useState(defaultValue.isConnected);
	const [accountEvmAddress, setAccountEvmAddress] = useState(
		defaultValue.accountEvmAddress,
	);

	return (
		<WalletConnectContext.Provider
			value={{
				accountId,
				setAccountId,
				isConnected,
				setIsConnected,
				accountEvmAddress,
				setAccountEvmAddress,
			}}
		>
			{props.children}
		</WalletConnectContext.Provider>
	);
};
