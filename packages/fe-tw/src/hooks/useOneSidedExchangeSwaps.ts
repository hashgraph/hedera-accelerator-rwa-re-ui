"use client";

import { useOneSidedExchangeFactoryAbi } from "@/services/contracts/abi/oneSidedExchangeFactoryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ONE_SIDED_EXCHANGE_ADDRESS } from "@/services/contracts/addresses";
import type {
   SwapTokenAddLiquidityRequestBody,
   SwapTokenPriceRequestBody,
   SwapTokenSwapRequestBody,
} from "@/types/erc3643/types";
import { useReadContract, useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useState } from "react";
import { hederaTestnet } from "viem/chains";
import useWriteContract from "./useWriteContract";

export const useOneSidedExchangeSwaps = () => {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { readContract } = useReadContract({
      chain: hederaTestnet as any,
   });

   const [isSwapTokensLoading, setSwapTokensLoading] = useState(false);
   const [isAddLiquidityLoading, setAddLiquidityLoading] = useState(false);
   const [isSetPriceForTokenLoading, setIsSetPriceForTokenLoading] = useState(false);

   const checkBalanceOfLiquidityToken = async (token: `0x${string}`): Promise<bigint> => {
      const balance = await readContract({
         address: token,
         abi: tokenAbi,
         functionName: "balanceOf",
         args: [ONE_SIDED_EXCHANGE_ADDRESS],
      });

      return balance as bigint;
   };

   const estimateTokensSwapSpendings = async (
      tokenA: `0x${string}`,
      tokenB: `0x${string}`,
      amount: bigint,
   ) => {
      const [tokenAAmount, tokenBAmount] = (await readContract({
         address: ONE_SIDED_EXCHANGE_ADDRESS,
         abi: useOneSidedExchangeFactoryAbi,
         functionName: "estimateTokenReturns",
         args: [tokenA, tokenB, amount],
      })) as bigint[];

      return [tokenAAmount, tokenBAmount];
   };

   const handleSetTokenPrice = (body: SwapTokenPriceRequestBody) => {
      setIsSetPriceForTokenLoading(true);

      return new Promise((res, rej) => {
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, ONE_SIDED_EXCHANGE_ADDRESS),
            abi: useOneSidedExchangeFactoryAbi,
            functionName: body.isSell ? "setSellPrice" : "setBuyPrice",
            args: [body.token, body.amount, body.thresholdIntervalInSeconds],
         }).then((tx) => {
            watch(tx as string, {
               onSuccess: (transaction) => {
                  res(transaction);
                  setIsSetPriceForTokenLoading(false);

                  return transaction;
               },
               onError: (transaction, err) => {
                  rej(err);
                  setIsSetPriceForTokenLoading(false);

                  return transaction;
               },
            });
         });
      });
   };

   const handleAddTokenLiquidity = (body: SwapTokenAddLiquidityRequestBody) => {
      setAddLiquidityLoading(true);

      return new Promise((res, rej) => {
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, body.tokenA),
            abi: tokenAbi,
            functionName: "approve",
            args: [ONE_SIDED_EXCHANGE_ADDRESS, body.amount],
         })
            .then((approveTx) => {
               const liquidityTxResults = {
                  approval: "",
                  liquidity: "",
               };

               watch(approveTx as string, {
                  onSuccess: (transaction) => {
                     liquidityTxResults.approval = transaction.transaction_id;

                     writeContract({
                        contractId: ContractId.fromEvmAddress(0, 0, ONE_SIDED_EXCHANGE_ADDRESS),
                        abi: useOneSidedExchangeFactoryAbi,
                        functionName: "addLiquidityForToken",
                        args: [body.tokenA, body.amount],
                     }).then((addLiquidityForTokenTx) => {
                        watch(addLiquidityForTokenTx as string, {
                           onSuccess: (transaction) => {
                              liquidityTxResults.liquidity = transaction.transaction_id;

                              setAddLiquidityLoading(false);
                              res(liquidityTxResults);

                              return transaction;
                           },
                           onError: (transaction, err) => {
                              rej(err);
                              setAddLiquidityLoading(false);

                              return transaction;
                           },
                        });
                     });

                     return transaction;
                  },
                  onError: (transaction, err) => {
                     rej(err);
                     setAddLiquidityLoading(false);

                     return transaction;
                  },
               });
            })
            .catch((err) => {
               rej(err);
               setAddLiquidityLoading(false);
            });
      });
   };

   const handleSwapTokens = async (body: SwapTokenSwapRequestBody): Promise<string> => {
      setSwapTokensLoading(true);

      return new Promise((res, rej) => {
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, ONE_SIDED_EXCHANGE_ADDRESS),
            abi: useOneSidedExchangeFactoryAbi,
            functionName: "swap",
            args: [body.tokenA, body.tokenB, body.amount],
         })
            .then((tx) => {
               watch(tx as string, {
                  onSuccess: (transaction) => {
                     setSwapTokensLoading(false);
                     res(transaction.transaction_id);

                     return transaction;
                  },
                  onError: (transaction, err) => {
                     setSwapTokensLoading(false);
                     rej(err);

                     return transaction;
                  },
               });
            })
            .catch((err) => {
               rej(err);
               setAddLiquidityLoading(false);
            });
      });
   };

   return {
      isSwapTokensLoading,
      isAddLiquidityLoading,
      isSetPriceForTokenLoading,
      estimateTokensSwapSpendings,
      checkBalanceOfLiquidityToken,
      handleAddTokenLiquidity,
      handleSwapTokens,
      handleSetTokenPrice,
   };
};
