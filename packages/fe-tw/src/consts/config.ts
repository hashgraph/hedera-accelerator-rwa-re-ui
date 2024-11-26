export const appConfig = {
	gasLimit: {
		METAMASK_GAS_LIMIT_ASSOCIATE: 800_000,
		METAMASK_GAS_LIMIT_TRANSFER_FT: 50_000,
		METAMASK_GAS_LIMIT_TRANSFER_NFT: 100_000,
		METAMASK_GAS_LIMIT_SEND_MESSAGE: 800_000,
	},
	currentNetwork: {
		network: "testnet",
		jsonRpcUrl: "https://testnet.hashio.io/api",
		mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
		chainId: "0x128",
	},
};
