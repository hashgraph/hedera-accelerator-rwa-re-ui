"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Select, { SingleValue } from "react-select";
import { Formik, Form, Field } from "formik";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { readContract } from "@/services/contracts/readContract";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";

/**
 * Example tokens
 */
export const TEST_TOKENS = [
  { value: "0x5d779c8966ABF3b9DeC6FBCDc19C98C4DcBe966D", label: "TEST_USDC" },
  { value: "0xC9fb85356eDb68a44055eC0B91CBB48b2c1C461A", label: "RWA_R_US" },
];

interface BuildingInfo {
  addr: string;
  nftId: string;
  tokenURI: string;
}

export function AddBuildingTokenLiquidityForm() {
  const { isAddingLiquidity, txHash, addLiquidity } = useBuildingLiquidity();

  const [buildingOptions, setBuildingOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchBuildingAddressesFromContract() {
      try {
        const buildingList = (await readContract({
          address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
          abi: buildingFactoryAbi,
          functionName: "getBuildingList",
        })) as BuildingInfo[];
        const options = buildingList.map((b) => ({
          value: b.addr,
          label: b.addr,
        }));

        setBuildingOptions(options);
      } catch (error) {
        console.error("Error fetching building addresses from contract:", error);
        toast.error("Failed to load building addresses from contract.");
      }
    }

    fetchBuildingAddressesFromContract();
  }, []);

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
      <h3 className="text-xl font-semibold mb-4">Add Liquidity</h3>

      <Formik
        initialValues={{
          buildingAddress: "",
          tokenAAddress: "",
          tokenBAddress: "",
          tokenAAmount: "100",
          tokenBAmount: "1",
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            {/** Building dropdown (fetched from the contract) */}
            <div>
              <label className="block text-sm font-semibold">Select Building</label>
              <Select
                placeholder="Choose a Building"
                options={buildingOptions}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("buildingAddress", option?.value || "");
                }}
                value={
                  values.buildingAddress
                    ? {
                        value: values.buildingAddress,
                        label:
                          buildingOptions.find((opt) => opt.value === values.buildingAddress)
                            ?.label ?? values.buildingAddress,
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
                options={TEST_TOKENS}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("tokenAAddress", option?.value || "");
                }}
                value={
                  values.tokenAAddress
                    ? {
                        value: values.tokenAAddress,
                        label:
                          TEST_TOKENS.find((t) => t.value === values.tokenAAddress)?.label || "",
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
                options={TEST_TOKENS}
                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                  setFieldValue("tokenBAddress", option?.value || "");
                }}
                value={
                  values.tokenBAddress
                    ? {
                        value: values.tokenBAddress,
                        label:
                          TEST_TOKENS.find((t) => t.value === values.tokenBAddress)?.label || "",
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
