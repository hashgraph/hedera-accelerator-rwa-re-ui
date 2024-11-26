import {
	type AccountId,
	type ContractId,
	type TokenId,
	type TopicId,
	type TransactionId,
} from "@hashgraph/sdk";

export interface WalletInterface {
	executeContractFunction: (
		contractId: ContractId,
		abi: readonly any[],
		functionName: string,
		args: any[],
		value?: any,
		gasLimit?: number,
	) => Promise<TransactionId | string | null>;
	disconnect: () => void;
	transferHBAR?: (
		toAddress: AccountId,
		amount: number,
	) => Promise<TransactionId | string | null>;
	transferFungibleToken?: (
		toAddress: AccountId,
		tokenId: TokenId,
		amount: number,
	) => Promise<TransactionId | string | null>;
	transferNonFungibleToken?: (
		toAddress: AccountId,
		tokenId: TokenId,
		serialNumber: number,
	) => Promise<TransactionId | string | null>;
	associateToken?: (tokenId: TokenId) => Promise<TransactionId | string | null>;
	sendMessage?: (
		topicId: TopicId,
		message: string,
	) => Promise<TransactionId | string | null>;
	fetchTokenInfo?: (tokenId: string) => Promise<string | null>;
}
