import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { readContract } from "@/services/contracts/readContract";
import { useWalletInterface } from "@/services/useWalletInterface";
import type { EvmAddress } from "@/types/common";
import { QueryKeys } from "@/types/queries";
import { useQuery } from "@tanstack/react-query";

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
