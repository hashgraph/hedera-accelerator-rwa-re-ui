"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useUniswapTradeSwaps } from "@/hooks/useUniswapTradeSwaps";
import { colourStyles } from "@/consts/theme";
import { oneHourTimePeriod } from "@/consts/trade";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { getTokenDecimals } from "@/services/erc20Service";
import { tryCatch } from "@/services/tryCatch";
import { TradeFormPayload } from "@/types/erc3643/types";

type Props = {
  buildingTokenOptions: { tokenAddress: `0x${string}`; tokenName: string }[];
};

const initialValues = {
  amount: "",
  tokenA: undefined,
  tokenB: USDC_ADDRESS,
  autoRevertsAfter: oneHourTimePeriod,
};

export default function TradeFormUniswapPool({ buildingTokenOptions }: Props) {
  const { handleSwap, getAmountsOut, giveAllowance } = useUniswapTradeSwaps();
  const [txResult, setTxResult] = useState<string>();
  const [txError, setTxError] = useState<string>();
  const [swapTokensAmountOutput, setSwapTokensAmountOutput] = useState<{
    amountA: bigint,
    amountB: bigint,
  }>();

  const buildingTokensOptions = useMemo(
    () =>
      buildingTokenOptions.map((tok) => ({
        label: tok.tokenName,
        value: tok.tokenAddress,
      })),
    [buildingTokenOptions],
  );

  const handleSwapSubmit = async (
    values: TradeFormPayload,
    resetForm: () => void,
  ) => {
    const amountA = values.amount;
    const tokenB = values.tokenB;
    const tokenA = values.tokenA;

    if (!tokenA || !tokenB || !amountA) {
      toast.error("All fields in trade form are required");
    } else {
      const { data: tokenADecimals, error: tokenADecimalsError } =
        await tryCatch(getTokenDecimals(tokenA!));

      if (tokenADecimalsError) {
        toast.error("Failed to swap tokens - falied calculate decimals");
        setTxError("Failed to swap tokens - falied calculate decimals");
        return;
      }

      const { data: outputAmounts, error: outputAmountsError } = await tryCatch(
        getAmountsOut(
          BigInt(Math.floor(parseFloat(amountA) * 10 ** tokenADecimals)),
          [tokenA!, tokenB!],
        ),
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
          deadline: Date.now() + (values.autoRevertsAfter ?? oneHourTimePeriod),
        });
  
        toast.success(
          `Successfully trade ${amountA} tokens of token ${tokenA} for ${tokenB}!`,
        );
        setTxResult(transaction_id);
      } catch (err) {
        console.log(`Error swapping tokens ${err?.toString()}`);
        toast.error(`Error swapping tokens ${err?.toString()}`);
        setTxError((err as { args: string[] }).args[0]);
      } finally {
        resetForm();
        setSwapTokensAmountOutput(undefined);
      }
    }
  };

  const revertsInOptions = new Array(24).fill(null).map((hour, index) => ({
    label: `In ${index + 1} hour`,
    value: (hour + 1) * oneHourTimePeriod,
  }));

  return (
    <div className="flex-1 flex-col gap-4 w-6/12">
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
        {({ values, handleSubmit, setFieldValue }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-10 border border-gray-300"
          >
            <h1 className="text-2xl font-bold mb-4">
              Trade Token via Uniswap Gateway
            </h1>
            <span className="text-sm text-gray-900">
              Select a building token you hold and swap it to another building
              token or USDC
            </span>
            <div className="mt-5">
              <label
                className="text-gray-500 text-md block mb-1 font-semibold"
                htmlFor="tokenASelect"
              >
                Select token A
              </label>
              <Select
                styles={colourStyles}
                onChange={(value) => {
                  setFieldValue("tokenA", value?.value);
                }}
                options={buildingTokensOptions}
                value={buildingTokensOptions.find(
                  (tok) => tok.value === values.tokenA,
                )}
              />
            </div>
            <div className="mt-5">
              <label
                className="text-gray-500 text-md block mb-1 font-semibold"
                htmlFor="tokenBSelect"
              >
                Select token B
              </label>
              <Select
                styles={colourStyles}
                options={[
                  {
                    value: USDC_ADDRESS,
                    label: "USDC",
                  },
                ]}
                value={{
                  value: USDC_ADDRESS,
                  label: "USDC",
                }}
                isDisabled
              />
            </div>
            <div className="mt-5">
              <label
                className="text-gray-500 text-md block mb-1 font-semibold"
                htmlFor="amount"
              >
                Amount of tokens to swap
              </label>
              <input
                id="amount"
                value={values.amount}
                onChange={(e) => {
                  setFieldValue("amount", e.target.value);
                }}
                className="input input-bordered w-full input-lg"
                placeholder="e.g. 0.00001"
                required
              />
            </div>
            <div className="mt-5 mb-5">
              <label
                className="text-gray-500 text-md block mb-1 font-semibold"
                htmlFor="autoRevertsAfter"
              >
                Auto reverts period in hours
              </label>
              <Select
                styles={colourStyles}
                onChange={(value) => {
                  setFieldValue("tokenB", value?.value);
                }}
                options={revertsInOptions}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
            >
              Swap tokens
            </button>
          </Form>
        )}
      </Formik>

      {!!swapTokensAmountOutput && (
        <div className="flex flex-col gap-5 mt-5">
          <p>Tokens A amount out: {swapTokensAmountOutput.amountA}</p>
          <p>Tokens B amount out: {swapTokensAmountOutput.amountB}</p>
        </div>
      )}
      {txResult && (
        <div className="flex mt-5">
          <p className="text-sm font-bold text-purple-600">
            Deployed Tx Hash: {txResult}
          </p>
        </div>
      )}
      {txError && (
        <div className="flex mt-5">
          <p className="text-sm font-bold text-purple-600">
            Deployed Tx Error: {txError}
          </p>
        </div>
      )}
    </div>
  );
}
