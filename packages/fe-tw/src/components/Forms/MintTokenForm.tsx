"use client";

import { Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CoinsIcon } from "lucide-react";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ContractId } from "@hashgraph/sdk";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { tryCatch } from "@/services/tryCatch";
// import { TxResultView } from "@/components/CommonViews/TxResultView";
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
         )) as any;

         toast.success(<TxResultToastView title="Tokens minted successfully!" txSuccess={tx} />);
      } catch (err: any) {
         toast.error(<TxResultToastView title="Error minting tokens" txError={err.message} />, {
            duration: Infinity,
         });
      }
   };

   return (
      <Card className="w-full max-w-md border-indigo-100 py-0">
         <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 py-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-100 rounded-lg">
                  <CoinsIcon className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <CardTitle className="text-xl text-indigo-900">Mint Building Tokens</CardTitle>
                  <CardDescription className="text-indigo-700/70">
                     Mint new tokens for your building.
                  </CardDescription>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pb-6">
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
