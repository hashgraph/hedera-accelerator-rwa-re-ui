import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { readContract } from "@/services/contracts/readContract";

export const readBalanceOf = (tokenAddress: `0x${string}`, accountEvmAddress: string | null) =>
   readContract({
      abi: tokenAbi,
      functionName: "balanceOf",
      address: tokenAddress.toString(),
      args: [accountEvmAddress],
   });
