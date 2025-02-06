"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Select, { SingleValue } from "react-select";
import { Formik, Form, Field } from "formik";

import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { tokens } from "@/consts/tokens";

/**
 * For testing, we hardcode a single building address
 */
const HARDCODED_BUILDING_ADDRESS = "0x0d1cb18E7Bc4b07199eAFcd29318999BED19f63E" as `0x${string}`;

const buildingOptions = [
  {
    value: HARDCODED_BUILDING_ADDRESS,
    label: `Hardcoded Building (${HARDCODED_BUILDING_ADDRESS})`,
  },
];

export function AddBuildingTokenLiquidityForm() {
  const { isAddingLiquidity, txHash, addLiquidity } = useBuildingLiquidity();

  const tokenSelectOptions = tokens.map((t) => ({
    value: t.address,
    label: t.symbol,
  }));

  async function handleSubmit(values: any, actions: any) {
    const { buildingAddress, tokenAAddress, tokenBAddress, tokenAAmount, tokenBAmount } = values;

    if (!buildingAddress || !tokenAAddress || !tokenBAddress || !tokenAAmount || !tokenBAmount) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    });

    actions.resetForm();
  }

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Liquidity (Hardcoded Building)</h3>

      <Formik
        initialValues={{
          buildingAddress: HARDCODED_BUILDING_ADDRESS,
          tokenAAddress: "",
          tokenBAddress: "",
          tokenAAmount: "100",
          tokenBAmount: "1",
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Select Building</label>
              <Select
                placeholder="Choose a Building"
                options={buildingOptions}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("buildingAddress", option?.value || "");
                }}
                // Show the one selected building
                value={{
                  value: values.buildingAddress,
                  label:
                    buildingOptions.find((opt) => opt.value === values.buildingAddress)?.label ??
                    values.buildingAddress,
                }}
              />
            </div>

            {/* Token A */}
            <div>
              <label className="block text-sm font-semibold">Select Token A</label>
              <Select
                placeholder="Pick Token A"
                options={tokenSelectOptions}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("tokenAAddress", option?.value || "");
                }}
                value={
                  values.tokenAAddress
                    ? {
                        value: values.tokenAAddress,
                        label:
                          tokenSelectOptions.find((t) => t.value === values.tokenAAddress)
                            ?.label || values.tokenAAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Token A Amount</label>
              <Field
                name="tokenAAmount"
                className="input input-bordered w-full"
                placeholder="e.g. 100"
              />
            </div>

            {/* Token B */}
            <div>
              <label className="block text-sm font-semibold">Select Token B</label>
              <Select
                placeholder="Pick Token B"
                options={tokenSelectOptions}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("tokenBAddress", option?.value || "");
                }}
                value={
                  values.tokenBAddress
                    ? {
                        value: values.tokenBAddress,
                        label:
                          tokenSelectOptions.find((t) => t.value === values.tokenBAddress)
                            ?.label || values.tokenBAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Token B Amount</label>
              <Field
                name="tokenBAmount"
                className="input input-bordered w-full"
                placeholder="e.g. 1"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isAddingLiquidity}
            >
              {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
            </button>
          </Form>
        )}
      </Formik>

      {txHash && (
        <div className="mt-4 text-sm text-gray-700">
          Liquidity Tx Hash: <span className="font-bold">{txHash}</span>
        </div>
      )}
    </div>
  );
}
