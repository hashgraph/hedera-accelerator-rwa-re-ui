import { useBuildings } from "@/hooks/useBuildings";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as React from "react";
import * as Yup from "yup";
import { toast } from "sonner";
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
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { ContractId } from "@hashgraph/sdk";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";

type Props = {
  buildingAddress?: `0x${string}`;
  handleGoAddLiquidity: () => void;
  setSelectedBuildingAddress: (buildingAddress: `0x${string}`) => void;
};

const initialValues = {
   tokenName: "",
   tokenSymbol: "",
   tokenDecimals: 18,
};

const copyToClipboard = (text: string) => {
   navigator.clipboard.writeText(text);
   toast.success('Successfully copied to clipboard');
};

export const DeployBuildingERC3643TokenForm = ({
  handleGoAddLiquidity,
  setSelectedBuildingAddress,
  buildingAddress,
}: Props) => {
   const [txError, setTxError] = useState<string>();
   const [txResult, setTxResult] = useState<string>();
   const [loading, setLoading] = useState(false);
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();
   const { buildings, buildingTokens } = useBuildings();
   const tokens = buildingTokens.filter(token => token.buildingAddress === buildingAddress);

   const handleSubmit = async (values: CreateERC3643RequestBody) => {
      setLoading(true);

      try {
         const tx = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "newERC3643Token",
            args: [buildingAddress, values.tokenName, values.tokenSymbol, values.tokenDecimals],
         }));

         setTxResult((tx as any)?.transaction_id);
         toast.success(`Token deployed successfully ${(tx as any)?.transaction_id}`);
      } catch (err) {
         setTxError((err as { args: string[] })?.args[0] ?? 'Token deploy error');
         toast.error((err as { args: string[] })?.args[0] ?? 'Token deploy error');
      }

      setLoading(false);
   };

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-md font-semibold mt-5 mb-5">
            Deploy ERC3643(USDC) Token for Building
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
                     <Label htmlFor="tokenName">Select Building Address</Label>

                     <Select
                        name="buildingAddress"
                        onValueChange={(value) => setSelectedBuildingAddress(value as `0x${string}`)}
                        value={buildingAddress}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Building" />
                        </SelectTrigger>
                        <SelectContent>
                           {buildings?.map((building) => (
                              <SelectItem
                                 key={building.address}
                                 value={building.address as `0x${string}`}
                              >
                                 {building.title} ({building.address})
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="w-full">
                     <Label htmlFor="tokenName">ERC3643 Token Name</Label>
                     <Input
                        placeholder="E.g: 0x"
                        className="mt-1"
                        {...getFieldProps("tokenName")}
                     />
                  </div>
                  <div className="w-full">
                     <Label htmlFor="tokenSymbol">ERC3643 Token Symbol</Label>
                     <Input
                        placeholder="E.g: TOK"
                        className="mt-1"
                        {...getFieldProps("tokenSymbol")}
                     />
                  </div>
                  <div className="w-full">
                     <Label htmlFor="tokenDecimals">ERC3643 Token Decimals</Label>
                     <Input
                        type="number"
                        placeholder="E.g: TOK"
                        className="mt-1"
                        {...getFieldProps("tokenDecimals")}
                     />
                  </div>
                  <div className="flex justify-end gap-5 mt-5">
                     <Button disabled={loading} isLoading={loading} type="submit">
                        Deploy
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        disabled={!tokens?.[0]?.tokenAddress}
                        onClick={handleGoAddLiquidity}
                     >
                        Add Liquidity
                     </Button>
                  </div>
                  {txError && (
                     <p className="text-sm text-red-600 break-all">
                        <span className="font-bold">Token Deployment Tx Error:</span>
                        <br />
                        <span
                           className="cursor-pointer hover:text-slate-200"
                        >{txError}</span>
                     </p>
                  )}
                  {txResult && (
                     <p className="text-sm text-green-600 break-all">
                        <span className="font-bold">Token Deployment Tx Hash:</span>
                        <br />
                        <span
                           onClick={() => {
                              copyToClipboard(txResult);
                           }}
                           style={{ textDecoration: "underline" }}
                           className="cursor-pointer hover:text-slate-200"
                        >{txResult}</span>
                     </p>
                  )}
               </Form>
            )}
         </Formik>
      </div>
   );
};
