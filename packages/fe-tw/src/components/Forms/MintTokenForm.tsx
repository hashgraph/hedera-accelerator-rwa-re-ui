"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CoinsIcon } from "lucide-react";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ContractId } from "@hashgraph/sdk";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { tryCatch } from "@/services/tryCatch";
import { TransactionExtended } from "@/types/common";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { toast } from "sonner";
import { FormInput } from "../ui/formInput";
import { USDC_ADDRESS } from "@/services/contracts/addresses";

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
         const tx = (await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, USDC_ADDRESS),
               args: [evmAddress as `0x${string}`, amountAsBigInt],
               functionName: "mint",
               abi: tokenAbi,
            }),
         )) as TransactionExtended;

         toast.success(<TxResultToastView title="Tokens minted successfully!" txSuccess={tx} />);
      } catch (err) {
         toast.error(<TxResultToastView title="Error minting tokens" txError={(err as unknown as { message: string }).message} />, {
            duration: Infinity,
         });
      }
   };

   return (
      <Card variant="indigo" className="max-w-md">
         <CardHeader
            icon={<CoinsIcon />}
            title="Mint Building Tokens"
            description="Mint new tokens for your building"
         />

         <CardContent>
            {!tokenAddress && (
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="font-medium text-amber-800">
                     Token for building needs to be deployed first
                  </p>
               </div>
            )}
            {!evmAddress && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="font-medium text-red-800">Connect wallet first</p>
               </div>
            )}
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
                  {({ getFieldProps, touched, errors }) => (
                     <Form className="space-y-6">
                        <div className="space-y-2">
                           <FormInput
                              type="number"
                              label="Tokens Amount"
                              placeholder="Enter amount of tokens to mint"
                              {...getFieldProps("tokensAmount")}
                              error={touched.tokensAmount ? errors.tokensAmount : undefined}
                           />
                        </div>

                        <Button
                           className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                           disabled={isLoading}
                           isLoading={isLoading}
                           type="submit"
                        >
                           {isLoading ? "Minting Tokens..." : "Mint Tokens"}
                        </Button>
                     </Form>
                  )}
               </Formik>
            )}
         </CardContent>
      </Card>
   );
};
