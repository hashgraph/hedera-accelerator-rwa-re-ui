import React, { useState } from "react";
import { useFormikContext, Form } from "formik";
import { XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/formInput";
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
import { DialogDescription } from "@radix-ui/react-dialog";
import { useBuildings } from "@/hooks/useBuildings";
import { BuildingToken, SliceAllocation } from "@/types/erc3643/types";

export const AddSliceAllocationForm = ({ assetOptions }: { assetOptions: BuildingToken[], allocations?: SliceAllocation[] }) => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { buildings, buildingsInfo } = useBuildings();
   const [tokensPercentageDialogOpen, setTokensPercentageDialogOpen] = useState(false);
   const lastSelectedAssetToken = formik.values.sliceAllocation.tokenAssets[formik.values.sliceAllocation.tokenAssets.length - 1];

   const handleOpenChange = (state: boolean) => {
      setTokensPercentageDialogOpen(state);
   };

   const handleConfirmAllocationAmount = () => {
      const newTokenAllocationValue = Number(formik.values.sliceAllocation.allocationAmount);

      if (newTokenAllocationValue) {
         formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
            ...formik.values.sliceAllocation.tokenAssetAmounts,
            [lastSelectedAssetToken]: newTokenAllocationValue,
         });
      } else {
         formik.setFieldValue("sliceAllocation.tokenAssetAmounts", {
            ...formik.values.sliceAllocation.tokenAssetAmounts,
            [lastSelectedAssetToken]: '100',
         });
      }

      setTokensPercentageDialogOpen(false);
   };

   const handleSelectTokenAsset = async (value: `0x${string}`) => {
      formik.setFieldValue("sliceAllocation.tokenAssets", [...formik.values.sliceAllocation?.tokenAssets, value]);
      setTokensPercentageDialogOpen(true);
   };

   return (
      <Form className="grid grid-cols-2 gap-4">
         <Dialog open={tokensPercentageDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>
                     Add allocation amount for token {buildings?.find((b) => b.address === lastSelectedAssetToken)?.title}
                  </DialogTitle>
                  <DialogDescription>
                     <span className="text-xs text-red-700">
                        In case of empty amount it's would be assigned automatically.
                     </span>
                  </DialogDescription>
               </DialogHeader>
               <Button onClick={handleConfirmAllocationAmount} type="button" className="lg:w-4/12">
                  Confirm
               </Button>
            </DialogContent>
         </Dialog>
      
         <div>
            <FormInput
               label="Slice Allocation Amount"
               placeholder="e.g. 100"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.allocationAmount ? formik.errors?.sliceAllocation?.allocationAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.allocationAmount")}
            />
         </div>

         <div>
            <FormInput
               label="Slice Deposit Amount"
               placeholder="e.g. 100"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.depositAmount ? formik.errors?.sliceAllocation?.depositAmount : undefined
               }
               {...formik.getFieldProps("sliceAllocation.depositAmount")}
            />
         </div>

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
      
         <div data-testid="select-token-assets">
            <Label htmlFor="tokenAssets">Select multiple token assets</Label>
               <Select
                  onValueChange={handleSelectTokenAsset}
                  required
                  defaultValue={formik.values.sliceAllocation?.tokenAssets[0]}
               >
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="e.g 0x.." />
                  </SelectTrigger>
                  <SelectContent>
                     {assetOptions
                        ?.map((opt) => (
                           <SelectItem key={opt.buildingAddress} value={opt.buildingAddress as string}>
                              <span data-testid={`token-asset-${opt.buildingAddress}`}>{buildings?.find((b) => b.address === opt.buildingAddress)?.title}</span>
                           </SelectItem>
                        ))
                     }
               </SelectContent>
               {
                  !!formik.errors.sliceAllocation?.tokenAssets &&
                  <span className="text-sm text-red-600">{formik.errors.sliceAllocation?.tokenAssets}</span>
               }
            </Select>
            {formik.values.sliceAllocation?.tokenAssets?.length > 0 && <div className="flex flex-col mt-5" style={{ overflowX: "scroll" }}>
               <p className="text-sm font-semibold">Selected Token Assets</p>

               {formik.values.sliceAllocation?.tokenAssets?.map((asset, assetId) => (
                  <Badge className="badge badge-md badge-soft badge-info p-2 m-1" key={asset + assetId}>
                     <div onClick={() => {
                        const newValues = formik.values.sliceAllocation.tokenAssets.filter(asset1 => asset1 !== asset);

                        formik.setFieldValue('sliceAllocation.tokenAssets', newValues);
                     }} style={{ width: 20, cursor: 'pointer' }}>
                        <XIcon style={{ width: 20 }} />
                     </div>
                     {buildings?.find(
                        (b) =>
                           b.address === buildingsInfo?.find(info => info.tokenAddress === asset)?.buildingAddress ||
                           b.address === asset
                     )?.title}
                     {asset ? ` ${asset}` : ''}
                     {formik.values.sliceAllocation.tokenAssetAmounts[asset] ? ` (${formik.values.sliceAllocation.tokenAssetAmounts[asset]})` : ''}
                  </Badge>
               ))}

               {!!formik.values.sliceAllocation.tokenAssetAmounts && (
                  <div className="flex flex-col">
                     <p className="text-sm mt-2">
                        <span className="font-semibold">Total Allocation: {'\n'}</span>
                        <span className="font-bold">{
                           Object.values(formik.values.sliceAllocation.tokenAssetAmounts)
                              .reduce((acc, amount) => acc += Number(amount), 0)
                           }
                        </span>
                     </p>
                  </div>
               )}
            </div>}
         </div>
      </Form>
   );
};
