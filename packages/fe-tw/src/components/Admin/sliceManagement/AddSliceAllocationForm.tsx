import React, { useMemo } from "react";
import { useFormikContext, Form } from "formik";
import { PlusIcon, MinusIcon, CoffeeIcon } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";
import { Button } from "@/components/ui/button";
import { useBuildings } from "@/hooks/useBuildings";
import { BuildingToken } from "@/types/erc3643/types";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/formInput";

type Props = {
   assetOptions: BuildingToken[],
   existsAllocations?: any[],
   useDepositAndRebalanceFlow?: boolean,
}
   
export const AddSliceAllocationForm = ({ assetOptions, useDepositAndRebalanceFlow = false, existsAllocations }: Props) => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { buildings } = useBuildings();
   const totalAllocationsAmount = Object.values(formik.values.sliceAllocation.tokenAssetAmounts)
      .reduce((acc, amount) => acc += Number(amount), 0);
   
   const tokenAssetRows = useMemo(() => {
      return formik.values.sliceAllocation?.tokenAssets?.map((asset, assetId) => (
         <div className="flex flex-row gap-2" key={asset || assetId}>
            <Select
               onValueChange={(value) => handleSelectTokenAsset(assetId, value)}
               value={formik.values.sliceAllocation?.tokenAssets[assetId]}
               disabled={!!existsAllocations?.find((alloc) => alloc === asset)}
            >
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick asset token" />
               </SelectTrigger>
               <SelectContent>
                  {assetOptions
                     ?.map((opt) => (
                        <SelectItem key={opt.buildingAddress} value={opt.buildingAddress as string}>
                           <span data-testid={`token-asset-${opt.buildingAddress}`}>
                              {buildings?.find((b) => b.address === opt.buildingAddress)?.title}
                           </span>
                        </SelectItem>
                     ))
                  }
               </SelectContent>
            </Select>
            <Input
               disabled={!!existsAllocations?.find((alloc) => alloc === asset)}
               placeholder="Allocation in Percentage (%)"
               defaultValue={formik.values.sliceAllocation?.tokenAssetAmounts[asset]}
               onChange={(e) => {
                  formik.setFieldValue(
                     'sliceAllocation.tokenAssetAmounts', 
                     {
                        ...formik.values.sliceAllocation.tokenAssetAmounts,
                        [asset]: e.target.value,
                     }
                  );
               }}
               style={{ maxWidth: '40%' }}
            />
            <div className="flex flex-row gap-2">
               <Button
                  type="button"
                  onClick={() => {
                     formik.setFieldValue(
                        'sliceAllocation.tokenAssets', 
                        [...formik.values.sliceAllocation.tokenAssets, undefined]
                     );
                  }}
                  style={{ width: 36, borderRadius: '50%', cursor: 'pointer' }}
               >
                  <PlusIcon width={20} />
               </Button>
               <Button
                  type="button"
                  disabled={formik.values.sliceAllocation.tokenAssets?.length === 1 || !!existsAllocations?.find((alloc) => alloc === asset)}
                  onClick={() => {
                     formik.setFieldValue(
                        'sliceAllocation.tokenAssets', 
                        formik.values.sliceAllocation.tokenAssets.filter((_, assetId1) => assetId1 !== assetId)
                     );
                     formik.setFieldValue(
                        'sliceAllocation.tokenAssetAmounts',
                        {
                           ...formik.values.sliceAllocation.tokenAssetAmounts,
                           [asset]: undefined,
                        }
                     );
                  }}
                  style={{ width: 36, borderRadius: '50%', cursor: 'pointer' }}
               >
                  <MinusIcon width={20} />
               </Button>
            </div>
         </div>
      ));
   }, [formik.values.sliceAllocation?.tokenAssets]);

   const handleSelectTokenAsset = async (rowId: number, value: string) => {
      formik.setFieldValue(
         "sliceAllocation.tokenAssets",
         formik.values.sliceAllocation.tokenAssets.map((asset, assetId) => assetId === rowId ? value : asset)
      );
   };

   return (
      <Form className="flex flex-col mt-10">
         <div className="flex flex-row mb-10">
            <CoffeeIcon className="mt-1" />
            <h1 className="text-2xl font-bold ml-3">Slice Allocations</h1>
         </div>

         <div className="flex flex-col gap-2 max-w-2xl">
            {tokenAssetRows}

            {formik.values.sliceAllocation?.tokenAssets?.some((asset) => asset !== undefined) && (
               <div className="flex flex-col" style={{ overflowX: "scroll" }} data-testid="select-token-assets">
                  {formik.errors.sliceAllocation?.tokenAssets && (
                     <p className="text-sm text-red-600">
                        {formik.errors.sliceAllocation?.tokenAssets as any}
                     </p> 
                  )}
                  {totalAllocationsAmount > 0 && (
                     <div className="flex flex-col">
                        <p className="text-sm mt-2">
                           <span className="font-semibold text-purple-800">Total Assets Allocation:{'\n'}</span>
                           <span className="font-bold">
                              ({totalAllocationsAmount}%)
                           </span>
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>

         {useDepositAndRebalanceFlow && (
            <div className="mt-5 max-w-2xl">
               <FormInput
                  label="Slice Deposit Amount"
                  placeholder="e.g. 100"
                  error={formik.errors?.sliceAllocation?.depositAmount}
                  {...formik.getFieldProps("sliceAllocation.depositAmount")}
               />
            </div>
         )}

         {/**
            <div>
               <FormInput
                  label="Token Reward Amount in USDC"
                  placeholder="e.g. 100"
                  className="mt-1"
                  error={
                     formik.touched?.sliceAllocation?.rewardAmount ? formik.errors?.sliceAllocation?.rewardAmount : undefined
                  }
                  {...formik.getFieldProps("sliceAllocation.rewardAmount")}
               />
            </div>
         **/}
      </Form>
   );
};
