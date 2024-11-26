import { ethers } from "ethers";

export async function readContract(parameters: any) {
	try {
		const contractInterface = new ethers.Interface(parameters.abi as []);

		const data = contractInterface.encodeFunctionData(
			parameters.functionName,
			parameters.args as [],
		);

		//@TODO check out the contract.viewOrPureMethod

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
					data: data,
					estimate: false,
					from: "0000000000000000000000000000000000000000",
					gas: 15000000,
					gasPrice: 1,
					to: parameters.address,
					value: 0,
				}),
			},
		);
		const result = (await response.json()).result;

		return contractInterface.decodeFunctionResult(
			parameters.functionName,
			result,
		) as any;
	} catch (e) {
		console.error("Error loading data from contract call");
		throw e;
	}
}
