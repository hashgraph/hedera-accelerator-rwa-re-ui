import { ContractId } from "@hashgraph/sdk";
import { ethers } from "ethers";

export async function estimateGas(
	from: string,
	contractId: ContractId,
	abi: readonly any[],
	functionName: string,
	args: any[],
	value?: bigint | undefined,
) {
	const contractInterface = new ethers.Interface(abi as []);

	const data = contractInterface.encodeFunctionData(functionName, args as []);

	// Seems like mirror node uses 8 decimals value format & limited to Long value while ethers.js uses 18 decimals
	let value8 = (value || BigInt(0)) / BigInt("10000000000");

	const response = await fetch(
		"https://testnet.mirrornode.hedera.com/api/v1/contracts/call",
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				block: "latest",
				data,
				estimate: true,
				from,
				gas: 15000000,
				gasPrice: 1,
				to: `0x${contractId.toSolidityAddress()}`,
				value: value8.toString(),
			}),
		},
	);
	return await response.json();
}
