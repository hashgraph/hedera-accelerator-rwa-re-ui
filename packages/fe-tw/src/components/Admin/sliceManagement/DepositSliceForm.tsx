
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
import { CreateSliceFormProps, AddSliceAllocationFormProps, DepositSliceFormProps } from "./constants";

export const DepositSliceForm = () => {
    const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
      deposit: DepositSliceFormProps,
   }>();
   const { autoCompounders } = useATokenVaultData();

   return (
      <Form className="grid grid-cols-2 gap-4">
         <div>
            <FormInput
               required
               label="Token Deposit Amount (%)"
               placeholder="e.g. 10"
               className="mt-1"
               error={
                formik.touched?.deposit?.amount ? formik.errors?.deposit?.amount : undefined
               }
               {...formik.getFieldProps("deposit.amount")}
            />
         </div>
         <div>
            <Label htmlFor="token">Token Asset (Auto Compounder Token)</Label>
            <Select
                onValueChange={(value) => {
                    formik.setFieldValue("deposit.token", value);
                }}
                required
            >
                <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Token Deposit Asset" />
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
