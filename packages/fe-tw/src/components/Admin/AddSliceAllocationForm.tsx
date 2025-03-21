import { useSlicesData } from "@/hooks/useSlicesData";
import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import type { AddAllocationRequest } from "@/types/erc3643/types";
import {
  useWatchTransactionReceipt,
  useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { Field, Form, Formik } from "formik";
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "react-daisyui";
import Select, { type SingleValue } from "react-select";

const CHAINLINK_PRICE_ID = "0x269501f5674BeE3E8fef90669d3faa17021344d0";
const initialValues = {
  tokenAsset: "",
  allocation: undefined,
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

type Props = {
  handleBack: () => void;
};

export const AddSliceAllocationForm = ({ handleBack }: Props) => {
  const { writeContract } = useWriteContract();
  const { watch } = useWatchTransactionReceipt();
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<string>();
  const [sliceAddress, setSliceAddress] = useState<`0x${string}`>();
  const { slices } = useSlicesData();
  const { autoCompounders } = useATokenVaultData();

  const buildingAssetsOptions = useMemo(
    () =>
      autoCompounders.map((token) => ({
        value: token.address as string,
        label: token.name,
      })),
    [autoCompounders],
  );

  const sliceOptions = useMemo(
    () =>
      slices.map((slice) => ({
        value: slice.address,
        label: slice.name,
      })),
    [slices],
  );

  const submitAddAllocationForm = useCallback(
    (values: AddAllocationRequest) => {
      setIsLoading(true);

      writeContract({
        contractId: ContractId.fromEvmAddress(
          0,
          0,
          sliceAddress as `0x${string}`,
        ),
        abi: sliceAbi,
        functionName: "addAllocation",
        args: [values.tokenAsset, CHAINLINK_PRICE_ID, values.allocation],
      }).then((tx) => {
        watch(tx as string, {
          onSuccess: (transaction) => {
            setIsLoading(false);
            setTxResult(transaction.transaction_id);

            return transaction;
          },
          onError: (transaction) => {
            setIsLoading(false);
            setTxResult(transaction.transaction_id);

            return transaction;
          },
        });
      });
    },
    [sliceAddress, writeContract, watch],
  );

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={submitAddAllocationForm}>
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Select Slice
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="e.g. 0x"
                options={sliceOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setSliceAddress(option?.value as `0x${string}`);
                }}
                value={
                  sliceAddress
                    ? {
                        value: sliceAddress,
                        label:
                          sliceOptions.find((t) => t.value === sliceAddress)
                            ?.label || sliceAddress,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="allocation"
              >
                Token Allocation (%)
              </label>
              <Field
                name="allocation"
                className="input w-full mt-2"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Select Token Asset (Auto Compounder Token)
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="e.g. 0x"
                options={buildingAssetsOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenAsset", option?.value || "");
                }}
                value={
                  values.tokenAsset
                    ? {
                        value: values.tokenAsset,
                        label:
                          buildingAssetsOptions.find(
                            (t) => t.value === values.tokenAsset,
                          )?.label || values.tokenAsset,
                      }
                    : null
                }
              />
            </div>
            <div className="flex gap-5 mt-5">
              <Button
                className="pr-20 pl-20"
                type="button"
                color="accent"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                className="pr-20 pl-20"
                type="submit"
                color="primary"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Allocation Adding..." : "Submit"}
              </Button>
            </div>
            {txResult && (
              <div className="flex mt-5">
                <p className="text-sm font-bold text-purple-600">
                  Allocation Tx Hash: {txResult}
                </p>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
