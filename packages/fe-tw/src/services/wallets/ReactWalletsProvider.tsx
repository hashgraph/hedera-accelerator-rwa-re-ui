import { HWBridgeProvider } from "@buidlerlabs/hashgraph-react-wallets";
import { HederaTestnet } from "@buidlerlabs/hashgraph-react-wallets/chains";
import {
	HashpackConnector,
	MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import type { SignClientTypes } from "@walletconnect/types";
import type React from "react";

const metadata: SignClientTypes.Metadata = {
	name: "RWA Demo UI",
	description: "RWA Demo UI",
	url: "http://localhost:3000/",
	icons: ["http://localhost:3000/logo192.png"],
};

// Create a new project in walletconnect cloud to generate a project id
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const ReactWalletsProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<HWBridgeProvider
			metadata={metadata}
			projectId={walletConnectProjectId}
			connectors={[HashpackConnector, MetamaskConnector]}
			chains={[HederaTestnet]}
		>
			{children}
		</HWBridgeProvider>
	);
};
