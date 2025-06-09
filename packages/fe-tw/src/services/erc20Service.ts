import { readContract } from "@/services/contracts/readContract";
import { tokenAbi } from "./contracts/abi/tokenAbi";
import { toast } from "sonner";

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

type TokenType = 'ERC721' | 'ERC20';

type TokenToMMPayload = {
   tokenAddress: `0x${string}`,
   tokenSymbol: `0x${string}`,
   tokenDecimals: string,
   tokenType: TokenType,
};

export const addTokenToMM = async ({ tokenAddress, tokenDecimals, tokenSymbol, tokenType }: TokenToMMPayload) => {
   if (!window?.ethereum) {
      toast.error('Metamask needs to be connected');
   }

   try {
      await window?.ethereum?.request({
         method: "wallet_watchAsset",
         params: {
            type: tokenType,
            options: {
               address: tokenAddress,
               symbol: tokenSymbol,
               decimals: tokenDecimals,
               image: "https://stormgain.com/sites/default/files/2021-06/breed-doge-main.jpg",
            },
         },
      });
   } catch (err) {
      toast.error(`Not possible to add ${tokenSymbol} token to MM`);
   }
};
