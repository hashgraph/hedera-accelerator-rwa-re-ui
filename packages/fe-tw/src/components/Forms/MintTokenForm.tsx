'use client';

import { Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CoinsIcon } from "lucide-react";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ContractId } from "@hashgraph/sdk";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { tryCatch } from "@/services/tryCatch";
import { TxResultView } from "@/components/CommonViews/TxResultView";
import { TransactionExtended } from "@/types/common";

type Props = { buildingId: string };

export const MintTokenForm = ({ buildingId }: Props) => {
    const { writeContract } = useWriteContract();
    const { executeTransaction } = useExecuteTransaction();
    const { data: evmAddress } = useEvmAddress();
    const { tokenAddress } = useBuildingInfo(buildingId);
    const [isLoading, setIsLoading] = useState(false);
    const [txResult, setTxResult] = useState<TransactionExtended>();
    const [txError, setTxError] = useState<string>();

    const handleDoMint = async (values: { tokensAmount?: string }) => {
        try {
            const { data: decimals } = await tryCatch(getTokenDecimals(tokenAddress));
            const amountAsBigInt = BigInt(
                Math.floor(Number.parseFloat(values.tokensAmount!) * 10 ** (decimals as any)),
            );
            const tx = await executeTransaction(() => writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, tokenAddress),
                args: [evmAddress as `0x${string}`, amountAsBigInt],
                functionName: "mint",
                abi: tokenAbi,
            })) as any;
            setTxError(undefined);
            setTxResult(tx);
        } catch (err: any) {
            setTxResult(undefined);
            setTxError("Error during minting");
        }
    };

    return (
        <div className="bg-white rounded-lg p-8 border border-gray-300 w-6/12">
            <div className="flex gap-4 bg-gray-200 rounded-md border border-gray-300 p-4">
                <h3 className="text-xl font-semibold mt-1">Mint Building Tokens</h3>
                <CoinsIcon size={36} />
            </div>
            {!tokenAddress && (
                <p className="font-bold">Token for building needs to be deployed first</p>
            )}
            {!evmAddress && <p className="font-bold">Connect wallet first</p>}
            {evmAddress && tokenAddress && (
                <Formik
                    initialValues={{
                        tokensAmount: undefined,
                    }}
                    validationSchema={Yup.object({
                        tokensAmount: Yup.string().required("Mint amount is required"),
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        setIsLoading(true);

                        await handleDoMint(values);

                        setSubmitting(false);
                        setIsLoading(false);
                        resetForm();
                    }}
                >
                {({ getFieldProps }) => (
                    <Form className="mt-10">
                        <div className="flex flex-col">
                            <div>
                                <Label htmlFor="tokensAmount" className="mb-2">Tokens Amount</Label>
                                <Input
                                    className="mt-1"
                                    placeholder="Amount of tokens to mint"
                                    {...getFieldProps("tokensAmount")}
                                />
                                <ErrorMessage name="tokensAmount">
                                    {(error) => <span className="label-text-alt text-red-700">{error}</span>}
                                </ErrorMessage>
                            </div>
                            <Button
                                className="mt-4 self-end w-30 mt-5"
                                disabled={isLoading}
                                isLoading={isLoading}
                                type="submit"
                            >
                                Mint
                            </Button>
                        </div>
                        <TxResultView txError={txError} txSuccess={txResult}  />
                    </Form>
                )}
                </Formik>
            )}
        </div>
    );
};
