"use client";

import { BackButton } from "@/components/Buttons/BackButton";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useBuildings } from "@/hooks/useBuildings";
import { Field, Form, Formik } from "formik";
import React, { useMemo } from "react";
import { toast } from "react-hot-toast";
import Select, { type SingleValue } from "react-select";

type Props = {
  buildingAddress: `0x${string}`;
  onGetDeployBuildingTokenView: () => void;
  onGetDeployATokenView: () => void;
};

const colourStyles = {
  control: (styles: object) => ({
    ...styles,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
  }),
  option: (styles: any) => ({
    ...styles,
    backgroundColor: "#fff",
    color: "#000",
    ":active": {
      ...styles[":active"],
      backgroundColor: "#9333ea36",
    },
    ":focused": {
      backgroundColor: "#9333ea36",
    },
  }),
};

export function AddBuildingTokenLiquidityForm({
  onGetDeployBuildingTokenView,
  onGetDeployATokenView,
  buildingAddress,
}: Props) {
  const { buildings } = useBuildings();
  const { isAddingLiquidity, txHash, txError, addLiquidity } =
    useBuildingLiquidity();
  const { deployedBuildingTokens } = useBuildingDetails(buildingAddress);

  async function handleSubmit(
    values: {
      buildingAddress: string;
      tokenBAddress: string;
      tokenAAddress: string;
      tokenAAmount: string;
      tokenBAmount: string;
    },
    actions: { resetForm: () => void },
  ) {
    const {
      buildingAddress: buildingAddressValue,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    } = values;
    const buildingAddressOneOf = buildingAddress || buildingAddressValue;

    if (
      !buildingAddressOneOf ||
      !tokenAAddress ||
      !tokenBAddress ||
      !tokenAAmount ||
      !tokenBAmount
    ) {
      toast.error("All fields are required.");
      return;
    }

    await addLiquidity({
      buildingAddress: buildingAddressOneOf,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
    });

    actions.resetForm();

    onGetDeployATokenView();
  }

  const tokenSelectOptions = useMemo(
    () => [
      ...deployedBuildingTokens.map((token) => ({
        value: token.tokenAddress,
        label: token.tokenAddress, // todo: replace with token name
      })),
      {
        value: "0x0000000000000000000000000000000000211103",
        label: "USDC",
      },
    ],
    [deployedBuildingTokens],
  );

  const buildingSelectOptions = useMemo(() => {
    return buildings.map((building) => ({
      value: building.address as `0x${string}`,
      label: building.title,
    }));
  }, [buildings]);

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <BackButton
        onHandlePress={() => {
          onGetDeployBuildingTokenView();
        }}
      />

      <h3 className="text-xl font-semibold mt-5 mb-5">
        Add Liquidity for Building Tokens
      </h3>

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
            {/* Building */}

            {!buildingAddress && (
              <div>
                <label
                  className="block text-md font-semibold text-purple-400"
                  htmlFor=""
                >
                  Select Building
                </label>
                <Select
                  styles={colourStyles}
                  className="mt-2"
                  placeholder="Choose a Building"
                  options={buildingSelectOptions}
                  onChange={(
                    option: SingleValue<{ value: string; label: string }>,
                  ) => {
                    setFieldValue("buildingAddress", option?.value || "");
                  }}
                  // Show the one selected building
                  value={{
                    value: values.buildingAddress,
                    label:
                      buildingSelectOptions.find(
                        (opt) => opt.value === values.buildingAddress,
                      )?.label ?? values.buildingAddress,
                  }}
                />
              </div>
            )}

            {/* Token A */}
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Select Token A
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="Pick Token A"
                options={tokenSelectOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenAAddress", option?.value || "");
                }}
                value={
                  values.tokenAAddress
                    ? {
                        value: values.tokenAAddress,
                        label:
                          tokenSelectOptions.find(
                            (t) => t.value === values.tokenAAddress,
                          )?.label || values.tokenAAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="tokenAAmount"
              >
                Token A Amount
              </label>
              <Field
                name="tokenAAmount"
                className="input w-full mt-2"
                placeholder="e.g. 100"
              />
            </div>

            {/* Token B */}
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Select Token B
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="Pick Token B"
                options={tokenSelectOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenBAddress", option?.value || "");
                }}
                value={
                  values.tokenBAddress
                    ? {
                        value: values.tokenBAddress,
                        label:
                          tokenSelectOptions.find(
                            (t) => t.value === values.tokenBAddress,
                          )?.label || values.tokenBAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="tokenBAmount"
              >
                Token B Amount
              </label>
              <Field
                name="tokenBAmount"
                className="input w-full mt-2"
                placeholder="e.g. 1"
              />
            </div>

            <div className="flex gap-5 mt-5">
                <button
                    className="btn btn-primary pr-20 pl-20"
                    type="submit"
                    disabled={isAddingLiquidity}
                >
                    {isAddingLiquidity ? (
                        <>
                            <span className="loading loading-spinner" />
                            Adding Liquidity...
                        </>
                    ) : (
                        "Add Liquidity"
                    )}
                </button>
                <button
                    className="btn pr-20 pl-20"
                    type="button"
                    onClick={() => onGetDeployATokenView()}
                >
                    To Vault/Compounder Deploy
                </button>
            </div>
          </Form>
        )}
      </Formik>

      {txHash && (
        <div className="mt-4 text-sm text-gray-700">
          Liquidity Tx Hash: <span className="font-bold">{txHash}</span>
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
