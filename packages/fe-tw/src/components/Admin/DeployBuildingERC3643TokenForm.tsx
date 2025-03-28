import { BackButton } from "@/components/Buttons/BackButton";
import { colourStyles } from "@/consts/theme";
import { useBuildingAdmin } from "@/hooks/useBuildingAdmin";
import { useBuildings } from "@/hooks/useBuildings";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { Field, Form, Formik } from "formik";
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
<<<<<<< HEAD
  onGetLiquidityView: (address?: `0x${string}`) => void;
  onGetDeployBuildingView?: () => void;
};

const initialValues = {
  tokenName: "",
  tokenSymbol: "",
  tokenDecimals: 18,
=======
   onGetLiquidityView: (address: `0x${string}`) => void;
   onGetDeployBuildingView?: () => void;
};

const initialValues = {
   tokenName: "",
   tokenSymbol: "",
   tokenDecimals: 18,
>>>>>>> origin/main
};

export const DeployBuildingERC3643TokenForm = ({
   onGetLiquidityView,
   onGetDeployBuildingView,
}: Props) => {
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const [txError, setTxError] = useState<string>();
   const [txResult, setTxResult] = useState<string>();
   const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  const { buildings } = useBuildings();
  const { createBuildingERC3643Token } = useBuildingAdmin(
    selectedBuildingAddress as `0x${string}`,
  );
=======
   const { buildings } = useBuildings();
   const { deployedBuildingTokens } = useBuildingDetails(selectedBuildingAddress as `0x${string}`);
   const { createBuildingERC3643Token } = useBuildingAdmin(
      selectedBuildingAddress as `0x${string}`,
   );
>>>>>>> origin/main

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

<<<<<<< HEAD
  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      {!!onGetDeployBuildingView && (
        <BackButton
          onHandlePress={() => {
            onGetDeployBuildingView?.();
          }}
        />)
      }
=======
   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-xl font-semibold mt-5 mb-5">
            Step 4 - Deploy ERC3643 Token for Building
         </h3>
>>>>>>> origin/main

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

<<<<<<< HEAD
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
        <Form className="space-y-4">
          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="tokenName"
            >
              Select Building Address
            </label>
            <Select
              className="mt-2"
              placeholder="Building Address"
              name="buildingAddress"
              onChange={(option) => {
                setSelectedBuildingAddress(option?.value as `0x${string}`);
              }}
              options={buildings.map((building) => ({
                value: building.address,
                label: `${building.title} (${building.address})`,
              }))}
              styles={colourStyles}
            />
          </div>
          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="tokenName"
            >
              ERC3643 Token Name
            </label>
            <Field
              name="tokenName"
              type="text"
              className="input w-full mt-2"
              placeholder="E.g: 0x"
            />
          </div>
          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="tokenSymbol"
            >
              ERC3643 Token Symbol
            </label>
            <Field
              name="tokenSymbol"
              type="text"
              className="input w-full mt-2"
              placeholder="E.g: TOK"
            />
          </div>
          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="tokenDecimals"
            >
              ERC3643 Token Decimals
            </label>
            <Field
              name="tokenDecimals"
              type="number"
              className="input w-full mt-2"
              placeholder="E.g: TOK"
            />
          </div>
          <div className="flex gap-5 mt-5">
            <button className="btn btn-primary pr-10 pl-10" type="submit">
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                "Deploy Token"
              )}
            </button>
            <button
              className="btn btn-primary pr-10 pl-10"
              type="button"
              onClick={() => onGetLiquidityView(selectedBuildingAddress)}
            >
              Add Liquidity
            </button>
          </div>
          {/*{selectedBuildingAddress && deployedBuildingTokens?.length > 0 && (*/}
          {/*	<p className="text-md text-purple-500 mt-5">*/}
          {/*		You can skip token creation and move on to add liquidity.*/}
          {/*	</p>*/}
          {/*)}*/}
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
      </Formik>
    </div>
  );
=======
                     <Select
                        name="buildingAddress"
                        onValueChange={(value) => setSelectedBuildingAddress(value)}
                        value={selectedBuildingAddress}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Choose a Building" />
                        </SelectTrigger>
                        <SelectContent>
                           {buildings.map((building) => (
                              <SelectItem key={building.address} value={building.address}>
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
                        Deploy token
                     </Button>
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
>>>>>>> origin/main
};
