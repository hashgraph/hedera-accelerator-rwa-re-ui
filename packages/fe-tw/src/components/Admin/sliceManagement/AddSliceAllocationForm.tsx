import React, { useMemo } from "react";
import { Form, FormikProps } from "formik";
import { PlusIcon, MinusIcon } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBuildings } from "@/hooks/useBuildings";
import { AddSliceAllocationRequestBody, BuildingToken } from "@/types/erc3643/types";
import { Input } from "@/components/ui/input";

type Props = {
   assetOptions: BuildingToken[],
   existsAllocations?: any[],
   formik: FormikProps<AddSliceAllocationRequestBody>,
   useOnCreateSlice?: boolean,
   addMoreAllocationsDisabled?: boolean,
}
   
export const AddSliceAllocationForm = ({ assetOptions, existsAllocations, formik, useOnCreateSlice, addMoreAllocationsDisabled = false }: Props) => {
   const { buildings } = useBuildings();

   const totalAllocationsAmount = Object.values(formik.values.tokenAssetAmounts)
      .reduce((acc, amount) => acc
         += Number(amount), 0);
   const tokenAssetErrors = formik.errors?.tokenAssets || (formik.errors as any)?.sliceAllocation?.tokenAssets;
   const tokenAssetRows = useMemo(() => {
      return formik.values?.tokenAssets?.map((asset, assetId) => (
         <div className="flex flex-row gap-2" key={asset || assetId}>
            <Select
               onValueChange={(value) => handleSelectTokenAsset(assetId, value)}
               value={formik.values?.tokenAssets[assetId]}
               disabled={!!existsAllocations?.find((alloc) => alloc === asset)}
            >
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick asset token" />
               </SelectTrigger>
               <SelectContent>
                  {assetOptions
                     ?.filter((opt) => opt.buildingAddress !== asset ? !formik.values?.tokenAssets?.includes(opt.buildingAddress) : true)
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
               defaultValue={formik.values?.tokenAssetAmounts[asset]}
               onChange={(e) => {
                  if (Number(e.target.value) <= 100) {
                     formik.setFieldValue(
                        useOnCreateSlice ? 'sliceAllocation.tokenAssetAmounts' : 'tokenAssetAmounts', 
                        {
                           ...formik.values?.tokenAssetAmounts,
                           [asset]: e.target.value,
                        }
                     );
                  }
               }}
               style={{ maxWidth: '40%' }}
            />
            <div className="flex flex-row gap-2">
               <Button
                  className="cursor-pointer w-12s"
                  type="button"
                  disabled={formik.values?.tokenAssets?.length === 1 || !!existsAllocations?.find((alloc) => alloc === asset)}
                  onClick={() => {
                     formik.setFieldValue(
                        useOnCreateSlice ? 'sliceAllocation.tokenAssets' : 'tokenAssets', 
                        formik.values?.tokenAssets.filter((asset2) => asset2 !== asset)
                     );
                     formik.setFieldValue(
                        useOnCreateSlice ? 'sliceAllocation.tokenAssetAmounts' : 'tokenAssetAmounts',
                        {
                           ...formik.values?.tokenAssetAmounts,
                           [asset]: undefined,
                        }
                     );
                  }}
               >
                  <MinusIcon width={20} />
               </Button>
            </div>
         </div>
      ));
   }, [formik.values?.tokenAssets]);

   const handleSelectTokenAsset = async (rowId: number, value: string) => {
      formik.setFieldValue(
         useOnCreateSlice ? 'sliceAllocation.tokenAssets' : 'tokenAssets',
         formik.values?.tokenAssets.map((asset, assetId) => assetId === rowId ? value : asset)
      );
   };

   return (
      <Form className="flex flex-col mt-10">
         <div className="flex flex-row mb-10">
            <h1 className="text-2xl font-bold ml-3">Slice Allocations</h1>
         </div>

         <div className="flex flex-col gap-2 max-w-2xl">
            {tokenAssetRows}

            <Button
               type="button"
               disabled={addMoreAllocationsDisabled}
               onClick={() => {
                  formik.setFieldValue(
                     useOnCreateSlice ? 'sliceAllocation.tokenAssets' : 'tokenAssets', 
                     [...formik.values?.tokenAssets, undefined]
                  );
               }}
               className="flex flex-row cursor-pointer lg:w-3/12"
            >
               <p className="font-semibold text-sm">New Asset</p>
               <PlusIcon width={20} strokeWidth={4} />
            </Button>

            {formik.values.tokenAssets?.some((asset) => asset !== undefined) && (
               <div className="flex flex-col overflow-scroll" data-testid="select-token-assets">
                  {tokenAssetErrors && (
                     <p className="text-sm text-red-600">
                        {tokenAssetErrors}
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
      </Form>
   );
};
