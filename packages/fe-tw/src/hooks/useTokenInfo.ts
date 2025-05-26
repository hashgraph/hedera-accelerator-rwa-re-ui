"use client";

import { useQuery } from "@tanstack/react-query";
import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

export interface TokenInfo {
   address: `0x${string}` | undefined;
   decimals: number;
   name: string;
   symbol: string;
   totalSupply: bigint;
   balanceOf?: bigint;
   owner?: string;
   isLoading: boolean;
   error: Error | null;
}

export const useTokenInfo = (tokenAddress: `0x${string}` | undefined) => {
   const { readContract } = useReadContract();
   const { data: evmAddress } = useEvmAddress();

   const { data, isLoading, error } = useQuery({
      queryKey: ["TOKEN_INFO", tokenAddress],
      queryFn: async (): Promise<Omit<TokenInfo, "isLoading" | "error" | "address">> => {
         if (!tokenAddress) {
            throw new Error("Token address is required");
         }

         const [decimals, name, symbol, totalSupply, balanceOf, owner] = await Promise.allSettled([
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "name",
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "symbol",
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "totalSupply",
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "owner",
            }).catch(() => null),
         ]);

         const tokenDecimals = decimals.status === "fulfilled" ? Number(decimals.value) : 18;
         const tokenName = name.status === "fulfilled" ? name.value : "Unknown Token";
         const tokenSymbol = symbol.status === "fulfilled" ? symbol.value : "UNKNOWN";
         const tokenTotalSupply =
            totalSupply.status === "fulfilled" ? BigInt(totalSupply.value) : BigInt(0);
         const tokenBalanceOf =
            owner.status === "fulfilled" && owner.value ? BigInt(balanceOf.value) : BigInt(0);
         const tokenOwner = owner.status === "fulfilled" && owner.value ? owner.value : undefined;

         return {
            decimals: tokenDecimals,
            name: tokenName,
            symbol: tokenSymbol,
            totalSupply: tokenTotalSupply,
            balanceOf: tokenBalanceOf,
            owner: tokenOwner,
         };
      },
      enabled: Boolean(tokenAddress) && Boolean(evmAddress),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
   });

   return {
      address: tokenAddress,
      decimals: data?.decimals ?? 18,
      name: data?.name ?? "Unknown Token",
      symbol: data?.symbol ?? "UNKNOWN",
      totalSupply: data?.totalSupply ?? BigInt(0),
      balanceOf: data?.balanceOf ?? BigInt(0),
      owner: data?.owner,
      isLoading,
      error: error as Error | null,
   };
};
