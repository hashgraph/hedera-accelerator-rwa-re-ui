import { useFormikContext } from "formik";
import { BuildingFormProps } from "@/components/Admin/buildingManagement/types";
import { FormInput } from "@/components/ui/formInput";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

const TokenForm = () => {
   const formik = useFormikContext<BuildingFormProps>();

   return (
      <div>
         <div>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Token</h2>
            </div>
            <div className={cn("grid grid-cols-2 gap-4 mt-5")}>
               <FormInput
                  required
                  label="Token Name"
                  {...formik.getFieldProps("token.tokenName")}
                  placeholder="e.g. My Building Token"
                  error={
                     formik.touched?.token?.tokenName ? formik.errors.token?.tokenName : undefined
                  }
               />

               <FormInput
                  required
                  label="Token Symbol"
                  {...formik.getFieldProps("token.tokenSymbol")}
                  placeholder="e.g. TOK"
                  error={
                     formik.touched?.token?.tokenSymbol
                        ? formik.errors.token?.tokenSymbol
                        : undefined
                  }
               />

               <FormInput
                  required
                  type="number"
                  label="Token Decimals"
                  {...formik.getFieldProps("token.tokenDecimals")}
                  placeholder="e.g. 18"
                  error={
                     formik.touched?.token?.tokenDecimals
                        ? formik.errors.token?.tokenDecimals
                        : undefined
                  }
               />
            </div>
         </div>

         <div className={cn("mt-4")}>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Mint</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
               <FormInput
                  required
                  type="number"
                  label="Mint Token Amount"
                  {...formik.getFieldProps("token.mintBuildingTokenAmount")}
                  placeholder="e.g. 1000"
                  error={
                     formik.touched?.token?.mintBuildingTokenAmount
                        ? formik.errors.token?.mintBuildingTokenAmount
                        : undefined
                  }
               />
            </div>
         </div>
      </div>
   );
};
export default TokenForm;
