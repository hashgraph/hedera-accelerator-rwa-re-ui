"use client";

import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useBuildings } from "@/hooks/useBuildings";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { toast } from "sonner";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
   buildingAddress: `0x${string}`;
   onGetDeployBuildingTokenView: () => void;
   onGetDeployATokenView: () => void;
};

export function AddBuildingTokenLiquidityForm({
   onGetDeployBuildingTokenView,
   onGetDeployATokenView,
   buildingAddress,
}: Props) {
   const { buildings } = useBuildings();
   const { isAddingLiquidity, txHash, txError, addLiquidity } = useBuildingLiquidity();
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
            Label: token.tokenAddress, // todo: replace with token name
         })),
         {
            value: "0x0000000000000000000000000000000000211103",
            Label: "USDC",
         },
      ],
      [deployedBuildingTokens],
   );

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-xl font-semibold mt-5 mb-5">Add Liquidity for Building Tokens</h3>

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
            {({ setFieldValue, getFieldProps, values }) => (
               <Form className="space-y-4">
                  {!buildingAddress && (
                     <div>
                        <Label htmlFor="">Select Building</Label>
                        <Select
                           name="buildingAddress"
                           onValueChange={(value) => setFieldValue("buildingAddress", value)}
                           value={values.buildingAddress}
                        >
                           <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Choose a Building" />
                           </SelectTrigger>
                           <SelectContent>
                              {buildings.map((building) => (
                                 <SelectItem key={building.address} value={building.address}>
                                    {building.title} ({building.address})
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  )}
                  <div>
                     <Label htmlFor="">Select Token A</Label>

                     <Select
                        name="tokenAAddress"
                        onValueChange={(value) => setFieldValue("tokenAAddress", value)}
                        value={values.tokenAAddress}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token" />
                        </SelectTrigger>
                        <SelectContent>
                           {tokenSelectOptions.map((token) => (
                              <SelectItem key={token.value} value={token.value}>
                                 {token.Label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="tokenAAmount">Token A Amount</Label>
                     <Input
                        className="mt-1"
                        placeholder="e.g. 100"
                        {...getFieldProps("tokenAAmount")}
                     />
                  </div>

                  {/* Token B */}
                  <div>
                     <Label htmlFor="">Select Token B</Label>

                     <Select
                        name="tokenBAddress"
                        onValueChange={(value) => setFieldValue("tokenBAddress", value)}
                        value={values.tokenBAddress}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token" />
                        </SelectTrigger>
                        <SelectContent>
                           {tokenSelectOptions.map((token) => (
                              <SelectItem key={token.value} value={token.value}>
                                 {token.Label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="tokenBAmount">Token B Amount</Label>
                     <Input
                        className="mt-1"
                        placeholder="e.g. 1"
                        {...getFieldProps("tokenBAmount")}
                     />
                  </div>

                  <div className="flex justify-end gap-5 mt-5">
                     <Button
                        variant="outline"
                        type="button"
                        onClick={() => onGetDeployATokenView()}
                     >
                        To Vault/Compounder Deploy
                     </Button>
                     <Button
                        type="submit"
                        disabled={isAddingLiquidity}
                        isLoading={isAddingLiquidity}
                     >
                        Add Liquidity
                     </Button>
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
               <p className="text-sm font-bold text-purple-600">Deployed Tx Error: {txError}</p>
            </div>
         )}
      </div>
   );
}
