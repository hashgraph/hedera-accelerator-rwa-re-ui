import { useBuildingAdmin } from "@/hooks/useBuildingAdmin";
import { useBuildings } from "@/hooks/useBuildings";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as React from "react";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

type Props = {
   onGetLiquidityView?: (buildingAddress: `0x${string}`) => void;
};

const initialValues = {
   tokenName: "",
   tokenSymbol: "",
   tokenDecimals: 18,
};

export const DeployBuildingERC3643TokenForm = ({
   onGetLiquidityView,
}: Props) => {
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const [txError, setTxError] = useState<string>();
   const [txResult, setTxResult] = useState<string>();
   const [loading, setLoading] = useState(false);

   const { buildings } = useBuildings();
   const { createBuildingERC3643Token } = useBuildingAdmin(
      selectedBuildingAddress as `0x${string}`,
   );

   const handleSubmit = async (values: CreateERC3643RequestBody) => {
      setLoading(true);

      try {
         const tx = await createBuildingERC3643Token(values);
         setTxResult(tx);
      } catch (err) {
         setTxError("Deploy of building token failed!");
      }

      setLoading(false);
   };

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-xl font-semibold mt-5 mb-5">
            Step 4 - Deploy ERC3643 Token for Building
         </h3>

         <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
               tokenName: Yup.string().required("Required"),
               tokenSymbol: Yup.string().required("Required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
               handleSubmit(values);
               setSubmitting(false);
            }}
         >
            {({ getFieldProps }) => (
               <Form className="space-y-4">
                  <div className="w-full">
                     <Label htmlFor="tokenName" className="text-gray-500 text-md block mb-1 font-semibold">Select Building Address</Label>

                     <Select
                        name="buildingAddress"
                        onValueChange={(value) => setSelectedBuildingAddress(value as `0x${string}`)}
                        value={selectedBuildingAddress}
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
                  <div className="w-full">
                     <Label htmlFor="tokenName" className="text-gray-500 text-md block mb-1 font-semibold">ERC3643 Token Name</Label>
                     <Input
                        placeholder="E.g: 0x"
                        className="mt-1"
                        {...getFieldProps("tokenName")}
                     />
                  </div>
                  <div className="w-full">
                     <Label htmlFor="tokenSymbol" className="text-gray-500 text-md block mb-1 font-semibold">ERC3643 Token Symbol</Label>
                     <Input
                        placeholder="E.g: TOK"
                        className="mt-1"
                        {...getFieldProps("tokenSymbol")}
                     />
                  </div>
                  <div className="w-full">
                     <Label htmlFor="tokenDecimals" className="text-gray-500 text-md block mb-1 font-semibold">ERC3643 Token Decimals</Label>
                     <Input
                        type="number"
                        placeholder="E.g: TOK"
                        className="mt-1"
                        {...getFieldProps("tokenDecimals")}
                     />
                  </div>
                  <div className="flex justify-end gap-5 mt-5">
                     <Button disabled={loading} isLoading={loading} type="submit">
                        Deploy token
                     </Button>
                     {onGetLiquidityView && <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                           onGetLiquidityView(selectedBuildingAddress as `0x${string}`)
                        }}
                     >
                        Add Liquidity
                     </Button>}
                  </div>
                  {txResult && (
                     <div className="flex mt-5">
                        <p className="text-sm font-bold text-purple-600">
                           Deployed Tx Hash: {txResult}
                        </p>
                     </div>
                  )}
                  {txError && (
                     <div className="flex mt-5">
                        <p className="text-sm font-bold text-purple-600">
                           Deployed Tx Error: {txError}
                        </p>
                     </div>
                  )}
               </Form>
            )}
         </Formik>
      </div>
   );
};
