import { useSlicesData } from "@/hooks/useSlicesData";
import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import type { AddAllocationRequest } from "@/types/erc3643/types";
import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { Form, Formik } from "formik";
import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useWriteContract from "@/hooks/useWriteContract";
import { CHAINLINK_PRICE_ID } from "@/services/contracts/addresses";

const initialValues = {
   tokenAsset: "",
   allocation: undefined,
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

   const submitAddAllocationForm = useCallback(
      (values: AddAllocationRequest) => {
         setIsLoading(true);

         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, sliceAddress as `0x${string}`),
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
            {({ setFieldValue, getFieldProps, values }) => (
               <Form className="space-y-4">
                  <div>
                     <Label htmlFor="sliceAddress">Select Slice</Label>
                     <Select
                        name="sliceAddress"
                        onValueChange={(value) => setSliceAddress(value as `0x${string}`)}
                        value={sliceAddress}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                           {slices.map((slice) => (
                              <SelectItem key={slice.address} value={slice.address}>
                                 {slice.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="allocation">Token Allocation (%)</Label>
                     <Input
                        className="mt-1"
                        {...getFieldProps("allocation")}
                        placeholder="e.g. 100"
                     />
                  </div>
                  <div>
                     <Label htmlFor="tokenAsset">Select Token Asset (Auto Compounder Token)</Label>
                     <Select
                        name="tokenAsset"
                        onValueChange={(value) => setFieldValue("tokenAsset", value)}
                        value={values.tokenAsset}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                           {autoCompounders.map((token) => (
                              <SelectItem key={token.address} value={token.address}>
                                 {token.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex justify-end gap-5 mt-5">
                     <Button variant="outline" onClick={handleBack}>
                        Back
                     </Button>
                     <Button disabled={isLoading} isLoading={isLoading} type="submit">
                        Submit
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
