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
	abiFunc.inputs?.forEach((input: any) => {
		functionParameters.addParam({
			type: input.type,
			name: input.name,
			value: args?.[index],
		});
		index++;
	});

	return functionParameters;
}
