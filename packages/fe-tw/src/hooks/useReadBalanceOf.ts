import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { readContract } from "@/services/contracts/readContract";
import { useWalletInterface } from "@/services/useWalletInterface";
import type { EvmAddress } from "@/types/common";
import { QueryKeys } from "@/types/queries";
import { useQuery } from "@tanstack/react-query";

export const readBalanceOf = (tokenAddress: `0x${string}`, accountEvmAddress: string | null) =>
   readContract({
      abi: tokenAbi,
      functionName: "balanceOf",
      address: tokenAddress.toString(),
      args: [accountEvmAddress],
   });

export function useReadBalanceOf(tokenAddress: EvmAddress) {
   const { accountEvmAddress } = useWalletInterface();

   return useQuery({
      queryKey: [QueryKeys.ReadBalanceOf, tokenAddress],
      enabled: !!tokenAddress,
      queryFn: () => readBalanceOf(tokenAddress, accountEvmAddress),
      initialData: () => BigInt(0),
   });
}
