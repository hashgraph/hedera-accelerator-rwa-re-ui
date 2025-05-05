import { readContract } from "@/services/contracts/readContract";
import { tokenAbi } from "./contracts/abi/tokenAbi";

export const getTokenDecimals = async (tokenAddress: `0x${string}`): Promise<number[]> => {
   return await readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "decimals",
      args: [],
   });
};

export const getTokenBalanceOf = async (tokenAddress: `0x${string}`, userAddress: string) => {
   return await readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "balanceOf",
      args: [userAddress],
   });
};

export const getTokenName = (tokenAddress: `0x${string}`) =>
   readContract({
      abi: tokenAbi,
      functionName: "name",
      address: tokenAddress,
      args: [],
   });

export const getTokenSymbol = async (tokenAddress: `0x${string}`) => {
   return await readContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "symbol",
      args: [],
   });
};
