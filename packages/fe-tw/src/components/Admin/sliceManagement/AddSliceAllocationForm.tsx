import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
import React from "react";
import { useFormikContext, Form } from "formik";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/formInput";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";

export const AddSliceAllocationForm = () => {
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();
   const { autoCompounders } = useATokenVaultData();

   return (
      <Form className="grid grid-cols-2 gap-4">
         <div>
            <FormInput
               required
               label="Token Allocation (%)"
               placeholder="e.g. Allocation"
               className="mt-1"
               error={
                  formik.touched?.sliceAllocation?.allocation ? formik.errors?.sliceAllocation?.allocation : undefined
               }
               {...formik.getFieldProps("sliceAllocation.allocation")}
            />
         </div>
            <div>
               <Label htmlFor="tokenAsset">Token Asset (Auto Compounder Token)</Label>
               <Select
                  onValueChange={(value) => formik.setFieldValue("sliceAllocation.tokenAsset", value)}
                  required
                  value={formik.values.sliceAllocation?.tokenAsset}
               >
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="Token Asset" />
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
      </Form>
   );
};
