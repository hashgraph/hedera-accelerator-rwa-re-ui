import { ContractFunctionParameterBuilder } from "@/services/wallets/contractFunctionParameterBuilder";

export function buildFunctionParamsFromAbi(
	abi: any,
	functionName: string,
	args: any[],
) {
	const abiFunc: any = abi.find(
		(item: any) => item.type === "function" && item.name === functionName,
	);

	let index = 0;

	const functionParameters = new ContractFunctionParameterBuilder();

	for (const input of abiFunc.inputs) {
		functionParameters.addParam({
			type: input.type,
			name: input.name,
			value: args?.[index],
		});
		index++;
	}

	return functionParameters;
}

export function shortEvmAddress(address: string | undefined): string {
	if (!address) {
		return "0x";
	}

	if (address.substring(0, 2) === "0x") {
		return `${address.substring(0, 7)}...${address.substring(address.length - 5)}`;
	}

	return address;
}
