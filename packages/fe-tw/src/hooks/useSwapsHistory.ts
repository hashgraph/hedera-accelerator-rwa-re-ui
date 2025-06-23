"use client";

import { useOneSidedExchangeFactoryAbi } from "@/services/contracts/abi/oneSidedExchangeFactoryAbi";
import {
   ONE_SIDED_EXCHANGE_ADDRESS,
   UNISWAP_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { SwapTradeItem } from "@/types/erc3643/types";
import { DEFAULT_TOKEN_DECIMALS, useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { useQuery } from "@tanstack/react-query";
import { ethers, ZeroAddress } from "ethers";
import { useEffect, useState } from "react";
import { uniswapFactoryAbi } from "@/services/contracts/abi/uniswapFactoryAbi";
import { uniswapPairAbi } from "@/services/contracts/abi/uniswapPairAbi";
import { readContract } from "@/services/contracts/readContract";
import { type Log, QueryKeys } from "@/types/queries";
import { tokens } from "@/consts/tokens";

const filterSwapHistoryItems = (swapItems: Log[], trader: `0x${string}`) => {
   return swapItems
      .filter((item) => item.args[0] === trader)
      .map((item) => ({
         tokenA: item.args[1],
         tokenB: item.args[2],
         tokenAAmount: ethers.formatUnits(item.args[3], DEFAULT_TOKEN_DECIMALS),
         tokenBAmount: ethers.formatUnits(item.args[4], DEFAULT_TOKEN_DECIMALS),
      }));
};

export const readUniswapPairs = (tokenAAddress: `0x${string}`, tokenBAddress: `0x${string}`) =>
   readContract({
      address: UNISWAP_FACTORY_ADDRESS,
      abi: uniswapFactoryAbi,
      functionName: "getPair",
      args: [tokenAAddress, tokenBAddress],
   }) as Promise<`0x${string}`>;

export const useSwapsHistory = (
   selectedTokensPair: { tokenA?: `0x${string}`; tokenB?: `0x${string}` },
   buildingTokenDecimals: {
      [key: `0x${string}`]: string;
   },
) => {
   const [oneSidedExchangeSwapsHistory, setOneSidedExchangeSwapsHistory] = useState<
      SwapTradeItem[]
   >([]);
   const [uniswapExchangeHistory, setUniswapExchangeHistory] = useState<SwapTradeItem[]>([]);

   const { data: pairAddressData } = useQuery({
      queryKey: [QueryKeys.ReadUniswapPairs],
      refetchInterval: 10000,
      enabled:
         !!selectedTokensPair?.tokenA &&
         !!selectedTokensPair.tokenB &&
         selectedTokensPair.tokenA !== ZeroAddress &&
         selectedTokensPair.tokenB !== ZeroAddress,
      queryFn: () => {
         return readUniswapPairs(selectedTokensPair?.tokenA!, selectedTokensPair?.tokenB!);
      },
   });
   const { data: evmAddress } = useEvmAddress();

   useEffect(() => {
      if (!!pairAddressData?.[0] && pairAddressData[0] !== ZeroAddress) {
         const unwatch = watchContractEvent({
            address: pairAddressData[0] as `0x${string}`,
            abi: uniswapPairAbi,
            eventName: "Swap",
            onLogs: (data) => {
               setUniswapExchangeHistory(
                  data.map((log: any, logId) => ({
                     tokenA: log.args[0],
                     tokenB: log.args[5],
                     tokenAAmount: ethers.formatUnits(log.args[1], 18).toString(),
                     tokenBAmount: ethers
                        .formatUnits(
                           log.args[4],
                           selectedTokensPair.tokenB ===
                              tokens.find((tok) => tok.symbol === "USDC")?.address
                              ? 6
                              : 18,
                        )
                        .toString(),
                     id: logId.toString(),
                  })),
               );
            },
         });

         return () => {
            unwatch();
         };
      }
   }, [pairAddressData, buildingTokenDecimals]);

   useEffect(() => {
      const unwatch = watchContractEvent({
         address: ONE_SIDED_EXCHANGE_ADDRESS as `0x${string}`,
         abi: useOneSidedExchangeFactoryAbi,
         eventName: "SwapSuccess",
         onLogs: (data) => {
            setOneSidedExchangeSwapsHistory((prev) => [
               ...prev,
               ...filterSwapHistoryItems(data as unknown as Log[], evmAddress),
            ]);
         },
      });

      return () => {
         unwatch();
      };
   }, []);

   useEffect(() => {
      if (selectedTokensPair?.tokenA && selectedTokensPair?.tokenB) {
         setUniswapExchangeHistory([]);
      }
   }, [selectedTokensPair?.tokenA, selectedTokensPair?.tokenB]);

   return { oneSidedExchangeSwapsHistory, uniswapExchangeHistory };
};
