import { useFormikContext } from "formik";
import { BuildingFormProps } from "@/components/Admin/buildingManagement/types";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { FormInput } from "@/components/ui/formInput";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

const TokenForm = ({ tokenDeployed, tokensMinted, liquidityAdded }) => {
   const formik = useFormikContext<BuildingFormProps>();

   const tokenLiquidityOptions = [
      {
         value: USDC_ADDRESS,
         label: `USDC (${USDC_ADDRESS})`,
      },
   ];

   return (
      <div>
         <div className={cn(tokenDeployed && "opacity-50 pointer-events-none")}>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Token</h2>
               {tokenDeployed && <CheckCheck />}
            </div>
            <div className={cn("grid grid-cols-2 gap-4 mt-5")}>
               <FormInput
                  required={!tokenDeployed}
                  label="Token Name"
                  {...formik.getFieldProps("token.tokenName")}
                  placeholder="e.g. My Building Token"
                  error={
                     formik.touched?.token?.tokenName ? formik.errors.token?.tokenName : undefined
                  }
               />

               <FormInput
                  required={!tokenDeployed}
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
                  required={!tokenDeployed}
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

               {/* token supply? */}
            </div>
         </div>

         <div className={cn("mt-4", tokensMinted && "opacity-50 pointer-events-none")}>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Mint</h2>
               {tokensMinted && <CheckCheck />}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
               <FormInput
                  required={!tokensMinted}
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

         <div className={cn("mt-4", liquidityAdded && "opacity-50 pointer-events-none")}>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-semibold">Liquidity</h2>
               {liquidityAdded && <CheckCheck />}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
               <FormInput
                  required
                  type="number"
                  label="Building Token Amount"
                  {...formik.getFieldProps("token.buildingTokenAmount")}
                  placeholder="e.g. 1000"
                  error={
                     formik.touched?.token?.buildingTokenAmount
                        ? formik.errors.token?.buildingTokenAmount
                        : undefined
                  }
               />
               <div>
                  <Label htmlFor="tokenBAddress">Select Token B</Label>

                  <Select
                     name="tokenBAddress"
                     onValueChange={(value) => formik.setFieldValue("token.tokenBAddress", value)}
                     value={formik.values.token.tokenBAddress}
                     disabled
                  >
                     <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Choose a Token" />
                     </SelectTrigger>
                     <SelectContent>
                        {tokenLiquidityOptions.map((token) => (
                           <SelectItem key={token.value} value={token.value}>
                              {token.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               <FormInput
                  required
                  label="Token B Amount"
                  {...formik.getFieldProps("token.tokenBAmount")}
                  placeholder="e.g. 1000"
                  error={
                     formik.touched?.token?.tokenBAmount
                        ? formik.errors.token?.tokenBAmount
                        : undefined
                  }
               />
            </div>
         </div>
      </div>
   );
};
export default TokenForm;
