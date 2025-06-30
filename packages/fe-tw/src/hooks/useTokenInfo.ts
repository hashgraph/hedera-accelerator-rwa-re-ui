"use client";

import { useQuery } from "@tanstack/react-query";
import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { tokenVotesAbi } from "@/services/contracts/abi/tokenVotesAbi";
import { UNISWAP_FACTORY_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { uniswapFactoryAbi } from "@/services/contracts/abi/uniswapFactoryAbi";
import { uniswapPairAbi } from "@/services/contracts/abi/uniswapPairAbi";
import { getTokenDecimals } from "@/services/erc20Service";
import { ethers } from "ethers";

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

   const { data: tokenPriceInUSDC } = useQuery({
      queryKey: ["TOKEN_PRICE_INFO"],
      queryFn: async () => {
         const pairAddress = await readContract({
            address: UNISWAP_FACTORY_ADDRESS,
            abi: uniswapFactoryAbi,
            functionName: "getPair",
            args: [tokenAddress, USDC_ADDRESS],
         });

         const [reserves, tokenDecimals, usdcDecimals] = await Promise.all([
            readContract({
               address: pairAddress,
               abi: uniswapPairAbi,
               functionName: "getReserves",
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
            readContract({
               address: USDC_ADDRESS,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         const convertedTokenAmount = Number(ethers.formatUnits(reserves[0], tokenDecimals));
         const convertedUsdcAmount = Number(ethers.formatUnits(reserves[1], usdcDecimals));

         return convertedUsdcAmount === 0 || convertedTokenAmount === 0
            ? 0
            : convertedUsdcAmount / convertedTokenAmount;
      },
      enabled: Boolean(tokenAddress),
   });

   const { data, isLoading, error, refetch } = useQuery({
      queryKey: ["TOKEN_INFO", tokenAddress],
      queryFn: async (): Promise<Omit<TokenInfo, "isLoading" | "error" | "address">> => {
         if (!tokenAddress) {
            throw new Error("Token address is required");
         }

         const [decimals, name, symbol, totalSupply, balanceOf, owner, complianceAddress] =
            await Promise.allSettled([
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
               readContract({
                  address: tokenAddress,
                  abi: tokenVotesAbi,
                  functionName: "compliance",
               }),
            ]);

         const tokenDecimals = decimals.status === "fulfilled" ? Number(decimals.value) : 18;
         const tokenName = name.status === "fulfilled" ? name.value : "Unknown Token";
         const tokenSymbol = symbol.status === "fulfilled" ? symbol.value : "UNKNOWN";
         const tokenTotalSupply =
            totalSupply.status === "fulfilled" ? BigInt(totalSupply.value) : BigInt(0);
         const tokenBalanceOf =
            owner.status === "fulfilled" && owner.value ? BigInt(balanceOf.value) : BigInt(0);
         const tokenOwner = owner.status === "fulfilled" && owner.value ? owner.value : undefined;
         const tokenComplianceAddress =
            complianceAddress.status === "fulfilled" ? complianceAddress.value : undefined;

         return {
            decimals: tokenDecimals,
            name: tokenName,
            symbol: tokenSymbol,
            totalSupply: tokenTotalSupply,
            balanceOf: tokenBalanceOf,
            owner: tokenOwner,
            complianceAddress: tokenComplianceAddress,
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
      complianceAddress: data?.complianceAddress,
      tokenPriceInUSDC,
      owner: data?.owner,
      isLoading,
      error: error as Error | null,
      refetch,
   };
};
