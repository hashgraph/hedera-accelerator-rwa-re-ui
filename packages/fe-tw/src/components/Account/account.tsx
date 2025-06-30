"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Shield, CheckCheck, AlertCircle } from "lucide-react";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { tryCatch } from "@/services/tryCatch";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { useIdentity } from "./useIdentity";
import { TransactionExtended } from "@/types/common";

const Account = () => {
   const { data: evmAddress } = useEvmAddress();
   const { identityData, deployIdentity, isLoading } = useIdentity();
   const [isDeploying, setIsDeploying] = useState(false);

   const handleDeployIdentity = async () => {
      setIsDeploying(true);

      const { data: result, error } = await tryCatch<TransactionExtended, {message: string}>(deployIdentity(evmAddress) as any);

      if (result?.success) {
         toast.success(
            <TxResultToastView title="Identity deployed successfully!" txSuccess={result} />,
         );
      } else if (result?.error) {
         toast.error(
            <TxResultToastView title="Error deploying identity" txError={result.error} />,
            { duration: Infinity },
         );
      } else if (error) {
         toast.error(
            <TxResultToastView title="Error deploying identity" txError={error.message} />,
            {
               duration: Infinity,
            },
         );
      }

      setIsDeploying(false);
   };

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <h1 className="text-2xl font-bold">Account Page</h1>
         <p className="text-gray-700">Manage your account settings and wallet identity.</p>

         {/* Wallet Identity Section */}
         <Card className="w-full max-w-md border-indigo-100 py-0">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 py-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                     <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                     <CardTitle className="text-xl text-indigo-900">Wallet Identity</CardTitle>
                     <CardDescription className="text-indigo-700/70">
                        Deploy ERC3643 compliant identity for your wallet
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
               {!evmAddress && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                     <p className="font-medium text-red-800">Connect wallet first</p>
                  </div>
               )}

               {identityData.isDeployed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                     <div className="flex items-center gap-2">
                        <CheckCheck className="w-5 h-5 text-green-600" />
                        <p className="font-medium text-green-800">Identity deployed</p>
                     </div>
                  </div>
               )}

               {!identityData.isDeployed && evmAddress && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                     <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <p className="font-medium text-amber-800">
                           No identity deployed for this wallet
                        </p>
                     </div>
                  </div>
               )}

               <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <h4 className="font-medium text-blue-900 mb-2">About ERC3643 Identity</h4>
                     <p className="text-sm text-blue-800">
                        ERC3643 is a standard for compliant tokenization that enables regulatory
                        compliance through on-chain identity verification. Deploying your wallet as
                        an identity allows you to interact with compliant tokenized real-world
                        assets.
                     </p>
                  </div>
                  {evmAddress && !identityData.isDeployed && (
                     <div className="flex justify-end">
                        <Button
                           className=" h-11 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                           disabled={isDeploying || identityData.isDeployed}
                           isLoading={isDeploying}
                           onClick={handleDeployIdentity}
                        >
                           {isDeploying ? "Deploying Identity..." : "Deploy Identity"}
                        </Button>
                     </div>
                  )}
               </>
            </CardContent>
         </Card>
      </div>
   );
};

export default Account;
