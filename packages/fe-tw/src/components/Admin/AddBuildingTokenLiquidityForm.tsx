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
import { BackButton } from "../Buttons/BackButton";
import { USDC_ADDRESS } from "@/services/contracts/addresses";

type Props = {
   buildingAddress?: `0x${string}`;
   onGetDeployATokenView?: () => void;
   onGetBack?: () => void;
};

export function AddBuildingTokenLiquidityForm({
   onGetDeployATokenView,
   onGetBack,
   buildingAddress,
}: Props) {
   const { buildings } = useBuildings();
   const { isAddingLiquidity, txHash, txError, addLiquidity } = useBuildingLiquidity();
   const { deployedBuildingTokens, tokenNames } = useBuildingDetails(buildingAddress);

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

      onGetDeployATokenView?.();
   }

   const tokenSelectOptions = useMemo(
      () => [
         ...deployedBuildingTokens.map((tok) => ({
            value: tok.tokenAddress,
            label: `${tokenNames[tok.tokenAddress]} (${tok.tokenAddress})`,
         })),
         {
            value: USDC_ADDRESS,
            label: `USDC (${USDC_ADDRESS})`,
         },
      ],
      [deployedBuildingTokens, tokenNames],
   );

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">

         <div className="flex flex-row items-center content-center gap-5 mb-5">
            {!!onGetBack && <BackButton onHandlePress={onGetBack} />}
            <h3 className="text-xl font-semibold">Add Liquidity for Building Tokens</h3>
         </div>

         <Formik
            initialValues={{
               buildingAddress: "",
               tokenAAddress: "",
               tokenBAddress: USDC_ADDRESS,
               tokenAAmount: "",
               tokenBAmount: "",
            }}
            onSubmit={handleSubmit}
         >
            {({ setFieldValue, getFieldProps, values }) => (
               <Form className="space-y-4">
                  {!buildingAddress && (
                     <div>
                        <Label htmlFor="buildingAddress" className="text-gray-500 text-md block mb-1 font-semibold">Choose a Building</Label>
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
                                 <SelectItem key={building.address} value={building.address as `0x${string}`}>
                                    {building.title} ({building.address})
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  )}
                  <div>
                     <Label htmlFor="tokenAAddress" className="text-gray-500 text-md block mb-1 font-semibold">Select Token A</Label>

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
                                 {token.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="tokenAAmount" className="text-gray-500 text-md block mb-1 font-semibold">Token A Amount</Label>
                     <Input
                        className="mt-1"
                        placeholder="e.g. 100"
                        {...getFieldProps("tokenAAmount")}
                     />
                  </div>

                  {/* Token B */}
                  <div>
                     <Label htmlFor="tokenBAddress" className="text-gray-500 text-md block mb-1 font-semibold">Select Token B</Label>

                     <Select
                        name="tokenBAddress"
                        onValueChange={(value) => setFieldValue("tokenBAddress", value)}
                        value={values.tokenBAddress}
                        disabled
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Token" />
                        </SelectTrigger>
                        <SelectContent>
                           {tokenSelectOptions.map((token) => (
                              <SelectItem key={token.value} value={token.value}>
                                 {token.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <Label htmlFor="tokenBAmount" className="text-gray-500 text-md block mb-1 font-semibold">Token B Amount</Label>
                     <Input
                        className="mt-1"
                        placeholder="e.g. 100"
                        {...getFieldProps("tokenBAmount")}
                     />
                  </div>

                  <div className="flex justify-end gap-5 mt-5">
                     {!!onGetDeployATokenView && <Button
                        variant="outline"
                        type="button"
                        onClick={() => onGetDeployATokenView()}
                     >
                        To Vault/Compounder Deploy
                     </Button>}
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
            <div className="mt-5 max-w-md">
               <p className="text-sm text-green-600 break-all">
                  Liquidity Tx Hash: <span className="font-bold">{txHash}</span>
               </p>
            </div>
         )}
         {txError && (
            <div className="mt-5 max-w-md">
               <p className="text-sm text-red-600 break-all">
                  Deployed Tx Error: <span className="font-bold">{txError}</span>
               </p>
            </div>
         )}
      </div>
   );
}
