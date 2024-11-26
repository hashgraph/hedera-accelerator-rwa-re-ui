"use client";

import {
	ContractId,
	type AccountId,
	type TokenId,
	TokenType,
	type TopicId,
	PrivateKey,
	TokenCreateTransaction,
	TokenMintTransaction,
	TokenInfoQuery,
} from "@hashgraph/sdk";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import type { WalletInterface } from "@/services/wallets/WalletInterface";
import { ContractFunctionParameterBuilder } from "@/services/wallets/contractFunctionParameterBuilder";
import { MetamaskContext } from "@/context/MetamaskContext";
import { appConfig } from "@/consts/config";
import { estimateGas } from "@/services/wallets/estimateGas";
import { buildFunctionParamsFromAbi } from "@/services/util";

const currentNetworkConfig = appConfig.currentNetwork;

export const switchToHederaNetwork = async (ethereum: any) => {
	try {
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: currentNetworkConfig.chainId }], // chainId must be in hexadecimal numbers
		});
	} catch (error: any) {
		if (error.code === 4902) {
			try {
				await ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainName: `Hedera (${currentNetworkConfig.network})`,
							chainId: currentNetworkConfig.chainId,
							nativeCurrency: {
								name: "HBAR",
								symbol: "HBAR",
								decimals: 18,
							},
							rpcUrls: [currentNetworkConfig.jsonRpcUrl],
						},
					],
				});
			} catch (addError) {
				console.error(addError);
			}
		}
		console.error(error);
	}
};

const getProvider = () => {
	if (!window.ethereum) {
		throw new Error("Metamask is not installed! Go install the extension!");
	}
	return new ethers.BrowserProvider(window.ethereum);
};

// returns a list of accounts
// otherwise empty array
export const connectToMetamask = async () => {
	const provider = getProvider();

	// keep track of accounts returned
	let accounts: string[] = [];

	try {
		await switchToHederaNetwork(window.ethereum);
		accounts = await provider.send("eth_requestAccounts", []);
	} catch (error: any) {
		if (error.code === 4001) {
			// EIP-1193 userRejectedRequest error
			console.warn("Please connect to Metamask.");
		} else {
			console.error(error);
		}
	}

	return accounts;
};

class MetaMaskWallet implements WalletInterface {
	private convertAccountIdToSolidityAddress(accountId: AccountId): string {
		const accountIdString =
			accountId.evmAddress !== null
				? accountId.evmAddress.toString()
				: accountId.toSolidityAddress();

		return `0x${accountIdString}`;
	}

	// Purpose: Transfer HBAR
	// Returns: Promise<string>
	// Note: Use JSON RPC Relay to search by transaction hash
	async transferHBAR(toAddress: AccountId, amount: number) {
		const provider = getProvider();
		const signer = await provider.getSigner();
		// build the transaction
		const tx = await signer.populateTransaction({
			to: this.convertAccountIdToSolidityAddress(toAddress),
			value: ethers.parseEther(amount.toString()),
		});
		try {
			// send the transaction
			const { hash } = await signer.sendTransaction(tx);
			await provider.waitForTransaction(hash);

			return hash;
		} catch (error: any) {
			console.warn(error.message ? error.message : error);
			return null;
		}
	}

	// async transferFungibleToken(
	// 	toAddress: AccountId,
	// 	tokenId: TokenId,
	// 	amount: number,
	// ) {
	// 	const hash = await this.executeContractFunction(
	// 		ContractId.fromString(tokenId.toString()),
	// 		"transfer",
	// 		new ContractFunctionParameterBuilder()
	// 			.addParam({
	// 				type: "address",
	// 				name: "recipient",
	// 				value: this.convertAccountIdToSolidityAddress(toAddress),
	// 			})
	// 			.addParam({
	// 				type: "uint256",
	// 				name: "amount",
	// 				value: amount,
	// 			}),
	// 		undefined,
	// 		appConfig.gasLimit.METAMASK_GAS_LIMIT_TRANSFER_FT,
	// 	);
	//
	// 	return hash;
	// }

	// async transferNonFungibleToken(
	// 	toAddress: AccountId,
	// 	tokenId: TokenId,
	// 	serialNumber: number,
	// ) {
	// 	const provider = getProvider();
	// 	const addresses = await provider.listAccounts();
	// 	const hash = await this.executeContractFunction(
	// 		ContractId.fromString(tokenId.toString()),
	// 		"transferFrom",
	// 		new ContractFunctionParameterBuilder()
	// 			.addParam({
	// 				type: "address",
	// 				name: "from",
	// 				value: addresses[0],
	// 			})
	// 			.addParam({
	// 				type: "address",
	// 				name: "to",
	// 				value: this.convertAccountIdToSolidityAddress(toAddress),
	// 			})
	// 			.addParam({
	// 				type: "uint256",
	// 				name: "nftId",
	// 				value: serialNumber,
	// 			}),
	// 		undefined,
	// 		appConfig.gasLimit.METAMASK_GAS_LIMIT_TRANSFER_NFT,
	// 	);
	//
	// 	return hash;
	// }

	// async associateToken(tokenId: TokenId) {
	// 	// send the transaction
	// 	// convert tokenId to contract id
	// 	const hash = await this.executeContractFunction(
	// 		ContractId.fromString(tokenId.toString()),
	// 		"associate",
	// 		new ContractFunctionParameterBuilder(),
	// 		undefined,
	// 		appConfig.gasLimit.METAMASK_GAS_LIMIT_ASSOCIATE,
	// 	);
	//
	// 	return hash;
	// }

	// async sendMessage(topicId: TopicId, message: string) {
	// 	// Convert the topicId to a ContractId
	// 	const contractId = ContractId.fromString(topicId.toString());
	// 	// Prepare the contract function parameters
	// 	const parameters = new ContractFunctionParameterBuilder();
	// 	parameters.addParam({
	// 		type: "string",
	// 		name: "message",
	// 		value: message,
	// 	}); // Add message as a parameter to the contract function
	//
	// 	const hash = await this.executeContractFunction(
	// 		contractId,
	// 		"submitMessage",
	// 		parameters,
	// 		undefined,
	// 		appConfig.gasLimit.METAMASK_GAS_LIMIT_SEND_MESSAGE,
	// 	);
	//
	// 	return hash;
	// }

	// async fetchTokenInfo(tokenId: string) {
	// 	// Prepare the Contract ID from the Token ID
	// 	const contractId = ContractId.fromString(tokenId.toString());
	// 	const parameters = new ContractFunctionParameterBuilder();
	//
	// 	const txHash = await this.executeContractFunction(
	// 		contractId,
	// 		"tokenInfo",
	// 		parameters,
	// 		undefined,
	// 		appConfig.gasLimit.METAMASK_GAS_LIMIT_SEND_MESSAGE,
	// 	);
	//
	// 	console.log(`Transaction hash: ${txHash}`);
	//
	// 	// Assuming the returned metadata is encoded, decode it if available
	// 	if (txHash?.metadata) {
	// 		const decodedMetadata = new TextDecoder().decode(txHash.metadata);
	// 		return decodedMetadata;
	// 	} else {
	// 		console.log("No metadata available for this token.");
	// 		return null;
	// 	}
	// }

	//
	// Purpose: build contract execute transaction and send to hashconnect for signing and execution
	// Returns: Promise<TransactionId | null>
	async executeContractFunction(
		contractId: ContractId,
		abi: any,
		functionName: string,
		args: any[],
		value?: any,
		gasLimit?: number,
	) {
		const functionParameters = buildFunctionParamsFromAbi(
			abi,
			functionName,
			args,
		);

		const provider = getProvider();
		const signer = await provider.getSigner();

		let gasLimitFinal = gasLimit;
		if (!gasLimitFinal) {
			const res = await estimateGas(
				signer.address,
				contractId,
				abi,
				functionName,
				functionParameters.buildEthersParams(),
				value,
			);
			if (res.result) {
				gasLimitFinal = parseInt(res.result, 16);
				console.log("L267 gasLimitFinal ===", gasLimitFinal);
			} else {
				const error = res._status?.messages?.[0];
				throw error?.detail || error?.data;
			}
		}

		// create contract instance for the contract id
		// to call the function, use contract[functionName](...functionParameters, ethersOverrides)
		const contract = new ethers.Contract(
			`0x${contractId.toSolidityAddress()}`,
			abi,
			signer,
		);

		try {
			const txResult = await contract[functionName](
				...functionParameters.buildEthersParams(),
				{
					gasLimit: gasLimitFinal,
					value,
				},
			);

			return txResult.hash;
		} catch (error: any) {
			console.warn(error.message ? error.message : error);
			return null;
		}
	}

	disconnect() {
		alert("Please disconnect using the Metamask extension.");
	}
}

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = () => {
	const { setMetamaskAccountAddress } = useContext(MetamaskContext);
	useEffect(() => {
		// set the account address if already connected
		try {
			const provider = getProvider();
			provider.listAccounts().then((signers) => {
				if (signers.length !== 0) {
					setMetamaskAccountAddress(signers[0].address);
				} else {
					setMetamaskAccountAddress("");
				}
			});

			// listen for account changes and update the account address
			window.ethereum?.on("accountsChanged", (accounts: unknown) => {
				if ((accounts as string[]).length !== 0) {
					setMetamaskAccountAddress((accounts as string[])[0]);
				} else {
					setMetamaskAccountAddress("");
				}
			});

			// cleanup by removing listeners
			return () => {
				window?.ethereum?.removeAllListeners();
			};
		} catch (error: any) {
			console.error(error.message ? error.message : error);
		}
	}, [setMetamaskAccountAddress]);

	return null;
};
