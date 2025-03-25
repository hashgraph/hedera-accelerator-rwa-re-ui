import { BackButton } from "@/components/Buttons/BackButton";
import { useBuildingAdmin } from "@/hooks/useBuildingAdmin";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { useBuildings } from "@/hooks/useBuildings";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import * as React from "react";
import Select from "react-select";
import * as Yup from "yup";

type Props = {
   onGetLiquidityView: (address: `0x${string}`) => void;
   onGetDeployBuildingView?: () => void;
};

const initialValues = {
   tokenName: "",
   tokenSymbol: "",
   tokenDecimals: 18,
};

const colourStyles = {
   control: (styles: object) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 8,
      backgroundColor: "#fff",
   }),
   option: (styles: any) => ({
      ...styles,
      backgroundColor: "#fff",
      color: "#000",
      ":active": {
         ...styles[":active"],
         backgroundColor: "#9333ea36",
      },
      ":focused": {
         backgroundColor: "#9333ea36",
      },
   }),
};

export const DeployBuildingERC3643TokenForm = ({
   onGetLiquidityView,
   onGetDeployBuildingView,
}: Props) => {
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const [txError, setTxError] = useState<string>();
   const [txResult, setTxResult] = useState<string>();
   const [loading, setLoading] = useState(false);

   const { buildings } = useBuildings();
   const { deployedBuildingTokens } = useBuildingDetails(selectedBuildingAddress as `0x${string}`);
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
         {/*{!!onGetDeployBuildingView && (*/}
         {/*	<BackButton*/}
         {/*		onHandlePress={() => {*/}
         {/*			onGetDeployBuildingView?.();*/}
         {/*		}}*/}
         {/*	/>*/}
         {/*)}*/}

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
                     {loading ? <span className="loading loading-spinner" /> : "Deploy Token"}
                  </button>

                  {/*<Button*/}
                  {/*	className="pr-10 pl-10"*/}
                  {/*	type="button"*/}
                  {/*	color="secondary"*/}
                  {/*	onClick={() =>*/}
                  {/*		onGetLiquidityView(selectedBuildingAddress as `0x${string}`)*/}
                  {/*	}*/}
                  {/*	disabled={*/}
                  {/*		deployedBuildingTokens.length === 0 || !selectedBuildingAddress*/}
                  {/*	}*/}
                  {/*>*/}
                  {/*	Add Liquidity*/}
                  {/*</Button>*/}
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
};
