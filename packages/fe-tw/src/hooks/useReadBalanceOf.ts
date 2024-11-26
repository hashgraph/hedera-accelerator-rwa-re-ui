import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/types/queries";
import { EvmAddress } from "@/types/common";
import { useWalletInterface } from "@/services/useWalletInterface";
import { readContract } from "@/services/contracts/readContract";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

export function useReadBalanceOf(tokenAddress: EvmAddress) {
	const { accountEvmAddress } = useWalletInterface();

	return useQuery({
		queryKey: [QueryKeys.ReadBalanceOf, tokenAddress],
		enabled: !!tokenAddress,
		queryFn: () =>
			readContract({
				abi: tokenAbi,
				functionName: "balanceOf",
				address: tokenAddress.toString(),
				args: [accountEvmAddress],
			}),
		initialData: () => BigInt(0),
	});
}
