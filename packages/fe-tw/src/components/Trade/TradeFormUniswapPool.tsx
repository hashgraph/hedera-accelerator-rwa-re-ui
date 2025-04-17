"use client";

import { ethers } from "ethers";
import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useUniswapTradeSwaps } from "@/hooks/useUniswapTradeSwaps";
import { oneHourTimePeriod } from "@/consts/trade";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { getTokenDecimals } from "@/services/erc20Service";
import { tryCatch } from "@/services/tryCatch";
import type { TradeFormPayload } from "@/types/erc3643/types";

type Props = {
   buildingTokenOptions: { tokenAddress: `0x${string}`; tokenName: string }[];
   displayOnBuildingPage?: boolean;
   onTokensPairSelected: (tokenA?: `0x${string}`, tokenB?: `0x${string}`) => void;
};

const initialValues = {
   amount: "",
   tokenA: undefined,
   tokenB: undefined,
   autoRevertsAfter: oneHourTimePeriod,
};

export default function TradeFormUniswapPool({ buildingTokenOptions, displayOnBuildingPage, onTokensPairSelected }: Props) {
   const { handleSwap, getAmountsOut, giveAllowance } = useUniswapTradeSwaps();
   const [txResult, setTxResult] = useState<string>();
   const [txError, setTxError] = useState<string>();
   const [swapTokensAmountOutput, setSwapTokensAmountOutput] = useState<{
      amountA: bigint;
      amountB: bigint;
   }>();
   const [swapTokensDecimals, setSwapTokensDecimals] = useState<{
      tokenA: number;
      tokenB: number;
   }>();

   const buildingTokensOptions = useMemo(
      () => [
         ...buildingTokenOptions.map((tok) => ({
            label: tok.tokenName,
            value: tok.tokenAddress,
         })),
         {
            value: USDC_ADDRESS,
            label: "USDC",
         },
      ],
      [buildingTokenOptions],
   );

   const handleSwapSubmit = async (values: TradeFormPayload, resetForm: () => void) => {
      setTxError(undefined);
      setTxResult(undefined);
      setSwapTokensAmountOutput(undefined);

      const amountA = values.amount;
      const tokenB = values.tokenB;
      const tokenA = values.tokenA;

      if (!tokenA || !tokenB || !amountA) {
         toast.error("All fields in trade form are required");
      } else {
         const { data: tokenADecimals, error: tokenADecimalsError } = await tryCatch(
            getTokenDecimals(tokenA!),
         );
         const { data: tokenBDecimals } = await tryCatch(getTokenDecimals(tokenB!));

         setSwapTokensDecimals({
            tokenA: (tokenADecimals as any)[0],
            tokenB: (tokenBDecimals as any)[0],
         });

         if (tokenADecimalsError) {
            toast.error("Failed to swap tokens - falied calculate decimals");
            setTxError("Failed to swap tokens - falied calculate decimals");
            return;
         }

         const { data: outputAmounts, error: outputAmountsError } = await tryCatch(
            getAmountsOut(BigInt(Math.floor(Number.parseFloat(amountA) * 10 ** tokenADecimals)), [
               tokenA!,
               tokenB!,
            ]),
         );

         if (outputAmountsError) {
            toast.error("Failed to swap tokens - falied calculate output amounts");
            setTxError("Failed to swap tokens - falied calculate output amounts");
            return;
         } else if (outputAmounts) {
            if (!outputAmounts[1]) {
               toast.error("Failed to swap tokens - tokens input amount must be adjusted");
               setTxError("Failed to swap tokens - tokens input amount must be adjusted");
               return;
            }

            setSwapTokensAmountOutput({
               amountA: outputAmounts[0],
               amountB: outputAmounts[1],
            });
         }

         try {
            await giveAllowance(tokenA, outputAmounts[0]);
            await giveAllowance(tokenB, outputAmounts[1]);

            const transaction_id = await handleSwap({
               amountIn: outputAmounts[0],
               amountOut: outputAmounts[1],
               path: [tokenA, tokenB],
               deadline:
                  Date.now() +
                  (values.autoRevertsAfter ? Number(values.autoRevertsAfter) : oneHourTimePeriod),
            });

            toast.success(`Successfully trade ${amountA} tokens of token ${tokenA} for ${tokenB}!`);
            setTxResult(transaction_id);
         } catch (err) {
            toast.error(`Error swapping tokens ${err?.toString()}`);
            setTxError((err as { args: string[] }).args[0]);
         } finally {
            resetForm();
         }
      }
   };

   const revertsInOptions = new Array(24).fill(null).map((_, index) => ({
      label: `In ${index + 1} hour`,
      value: (index + 1) * oneHourTimePeriod,
   }));

   return (
      <div className="min-w-150">
         <Formik
            onSubmit={(values, { setSubmitting, resetForm }) => {
               setSubmitting(false);
               handleSwapSubmit(values, resetForm);
            }}
            initialValues={initialValues}
            validationSchema={Yup.object({
               amount: Yup.string().required(),
               tokenA: Yup.string().required(),
               tokenB: Yup.string().required(),
               autoRevertsAfter: Yup.string(),
            })}
         >
            {({ values, handleSubmit, setFieldValue, getFieldProps }) => (
               <Form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-lg p-10 border border-gray-300 space-y-4"
               >
                  <h1 className="text-2xl font-bold mb-4">
                     {displayOnBuildingPage ? 'Trade Building Token via Uniswap Gateway to USDC' : 'Trade any Token via Uniswap Gateway'}
                  </h1>
                  <p className="text-sm text-gray-900 mb-4">
                     Select a building token you hold and swap it to another building token or USDC
                  </p>
                  <div>
                     <Label htmlFor="tokenASelect">Select token A</Label>
                     <Select
                        name="tokenA"
                        onValueChange={(value) => {
                           setFieldValue("tokenA", value)
                           onTokensPairSelected(value as `0x${string}`);
                        }}
                        value={values.tokenA}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token A" />
                        </SelectTrigger>
                        <SelectContent>
                           {buildingTokensOptions
                              .filter(token => token.value !== values.tokenB)
                              .map((building) => (
                                 <SelectItem
                                    key={building.value}
                                    value={building.value as `0x${string}`}
                                 >
                                    {building.label} ({building.value})
                                 </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="tokenBSelect">Select token B</Label>
                     <Select
                        name="tokenB"
                        onValueChange={(value) => {
                           setFieldValue("tokenB", value);
                           onTokensPairSelected(undefined, value as `0x${string}`);
                        }}
                        value={values.tokenB}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token B" />
                        </SelectTrigger>
                        <SelectContent>
                           {buildingTokensOptions
                              .filter(token => token.value !== values.tokenA)
                              .map((token) => (
                                 <SelectItem
                                    key={token.value}
                                    value={token.value as `0x${string}`}
                                 >
                                    {token.label} ({token.value})
                                 </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="amount">Amount of tokens to swap</Label>
                     <Input
                        style={{
                           fontSize: 15,
                        }}
                        className="mt-1"
                        placeholder="e.g. 100"
                        {...getFieldProps("amount")}
                     />
                  </div>
                  <div>
                     <Label htmlFor="autoRevertsAfter">Auto reverts period in hours</Label>
                     <Select
                        name="autoRevertsAfter"
                        onValueChange={(value) => {
                           setFieldValue("autoRevertsAfter", Number(value));
                        }}
                        value={values.autoRevertsAfter as unknown as string}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Period in hours" />
                        </SelectTrigger>
                        <SelectContent>
                           {revertsInOptions.map((token) => (
                              <SelectItem
                                 key={token.value}
                                 value={token.value as unknown as string}
                              >
                                 {token.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  {!!values.tokenA && !!values.tokenB && values.tokenA === values.tokenB && (
                     <p className="text-sm text-red-600 font-bold">
                        Tokens A and B should be different
                     </p>
                  )}
                  <Button
                     className="mt-4 self-end"
                     type="submit"
                     disabled={!values.tokenA || !values.tokenB || values.tokenA === values.tokenB}
                  >
                     Swap tokens
                  </Button>
               </Form>
            )}
         </Formik>

         {!!swapTokensAmountOutput && (
            <div className="flex flex-col gap-1 mt-5">
               <span className="text-sm text-purple-600">
                  Tokens A amount in:{" "}
                  {ethers.formatUnits(swapTokensAmountOutput.amountA, swapTokensDecimals?.tokenA)}
               </span>
               <span className="text-sm text-purple-600">
                  Tokens B amount out:{" "}
                  {ethers.formatUnits(swapTokensAmountOutput.amountB, swapTokensDecimals?.tokenB)}
               </span>
            </div>
         )}

         {txResult && (
            <div className="flex mt-5">
               <p className="text-sm font-bold text-purple-600">Deployed Tx Hash: {txResult}</p>
            </div>
         )}

         {txError && (
            <div className="flex mt-5">
               <p className="text-sm font-bold text-purple-600">Deployed Tx Error: {txError}</p>
            </div>
         )}
      </div>
   );
}
