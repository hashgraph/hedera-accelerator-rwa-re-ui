"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import type { MintRequestPayload } from "@/types/erc3643/types";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { tokens } from "@/consts/tokens";
import { getTokenDecimals } from "@/services/erc20Service";

type Props = {
   buildingAddress?: `0x${string}`;
   onMintSuccess: () => void;
};

const initialMintValues = {
   amount: "",
   token: "",
};

export const MintERC3643TokenForm = (props: Props) => {
   const { deployedBuildingTokens, tokenNames } = useBuildingDetails(props.buildingAddress);
   const { writeContract } = useWriteContract();
   const [txHash, setTxHash] = useState<string>();
   const [txError, setTxError] = useState<string>();
   const [txInProgress, setTxInProgress] = useState(false);
   const { data: evmAddress } = useEvmAddress();

   console.log(deployedBuildingTokens);

   const handleSubmit = async (values: MintRequestPayload) => {
      setTxInProgress(true);

      try {
         const tokenDecimals = await getTokenDecimals(values.token as `0x${string}`);
         const tx = await writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, values.token),
            abi: tokenAbi,
            functionName: "mint",
            args: [
               evmAddress,
               BigInt(Math.floor(Number.parseFloat(values.amount!) * 10 ** tokenDecimals)),
            ],
         });
         setTxHash(tx as string);

         setTimeout(() => {
            props.onMintSuccess();
         }, 10000);
      } catch (err) {
         setTxError((err as { message: string })?.message ?? "");
      } finally {
         setTxInProgress(false);
      }
   };

   const tokenSelectOptions = [
      ...deployedBuildingTokens.map((tok) => ({
         value: tok.tokenAddress,
         label: `${tokenNames[tok.tokenAddress]} (${tok.tokenAddress})`,
      })),
      {
         value: USDC_ADDRESS,
         label: `USDC (${USDC_ADDRESS})`,
      },
   ];

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-xl font-semibold mb-5">Mint ERC3643 Token</h3>

         <Formik initialValues={initialMintValues} onSubmit={handleSubmit}>
            {({ values, setFieldValue, getFieldProps }) => (
               <Form className="space-y-4">
                  {/* Token Address */}
                  <div>
                     <Label
                        htmlFor="token"
                        className="text-gray-500 text-md block mb-1 font-semibold"
                     >
                        Choose a Token
                     </Label>
                     <Select
                        name="token"
                        onValueChange={(value) => setFieldValue("token", value)}
                        value={values.token}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token" />
                        </SelectTrigger>
                        <SelectContent>
                           {tokenSelectOptions.map((slice) => (
                              <SelectItem key={slice.value} value={slice.value}>
                                 {slice.label}
                              </SelectItem>
                           ))}
                           <SelectItem value={"0x431919c81a18fc967824a85581b6a3782587f21f"}>
                              ???
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {/* Token Amount */}
                  <div>
                     <Label
                        htmlFor="amount"
                        className="text-gray-500 text-md block mb-1 font-semibold"
                     >
                        Token Amount
                     </Label>
                     <Input className="mt-1" {...getFieldProps("amount")} placeholder="e.g. 100" />
                  </div>

                  <div className="flex gap-5 mt-5">
                     <Button>
                        {txInProgress ? (
                           <>
                              <span className="loading loading-spinner" />
                              Minting in progress...
                           </>
                        ) : (
                           "Mint Token"
                        )}
                     </Button>
                  </div>
               </Form>
            )}
         </Formik>

         {txHash && (
            <div className="mt-4">
               <p className="text-xs text-green-600 break-all">
                  Mint Tx Hash: <span className="font-bold">{txHash}</span>
               </p>
            </div>
         )}
         {txError && (
            <div className="mt-4">
               <p className="text-xs text-red-600">
                  Mint Tx Error: <span className="font-bold">{txError}</span>
               </p>
            </div>
         )}
      </div>
   );
};
