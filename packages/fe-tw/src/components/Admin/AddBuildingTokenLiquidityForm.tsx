"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import Select, { SingleValue } from "react-select";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";

// 1) Import your tokens from the shared file
import { tokens } from "@/consts/tokens";

/** 
 * Hardcode a building address for testing
 */
const HARDCODED_BUILDING_ADDRESS = "0x0d1cb18E7Bc4b07199eAFcd29318999BED19f63E";

export function AddBuildingTokenLiquidityForm() {
  const { isAddingLiquidity, txHash, addLiquidity } = useBuildingLiquidity();

  const [buildingOption] = useState<{ value: string; label: string }[]>([
    {
      value: HARDCODED_BUILDING_ADDRESS,
      label: `Hardcoded Building (${HARDCODED_BUILDING_ADDRESS})`,
    },
  ]);

  const tokenSelectOptions = tokens.map((token) => ({
    value: token.address,
    label: token.symbol, 
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
            {/** Building dropdown (hardcoded atm for testing) */}
            <div>
              <label className="block text-sm font-semibold">Select Building</label>
              <Select
                placeholder="Hardcoded Building"
                options={buildingOption}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("buildingAddress", option?.value || "");
                }}
                value={
                  values.buildingAddress
                    ? {
                        value: values.buildingAddress,
                        label:
                          buildingOption.find((opt) => opt.value === values.buildingAddress)
                            ?.label || values.buildingAddress,
                      }
                    : null
                }
              />
            </div>

            {/** Token A */}
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
                          tokenSelectOptions.find((t) => t.value === values.tokenAAddress)?.label ||
                          values.tokenAAddress,
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

            {/** Token B */}
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
                          tokenSelectOptions.find((t) => t.value === values.tokenBAddress)?.label ||
                          values.tokenBAddress,
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
