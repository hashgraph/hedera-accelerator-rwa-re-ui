"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import { useWalletInterface } from "@/services/useWalletInterface";
import { ContractId } from "@hashgraph/sdk";

import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { uploadJsonToPinata } from "@/services/ipfsService"; 

interface AddBuildingFormValues {
  name: string;
  location: string;
  tokenSupply: number;
}

export function AddBuildingForm() {
  const { walletInterface } = useWalletInterface();

  const initialValues: AddBuildingFormValues = {
    name: "",
    location: "",
    tokenSupply: 1000000,
  };

  async function handleSubmit(values: AddBuildingFormValues, { resetForm }: any) {
    try {
      if (!walletInterface) {
        toast.error("No wallet connected. Please connect first.");
        return;
      }

      const metadata = {
        name: values.name,
        location: values.location,
        supply: values.tokenSupply,
      };

      const ipfsHash = await uploadJsonToPinata(metadata);
      const tokenURI = `ipfs://${ipfsHash}`;  
      const txHashOrId = await walletInterface.executeContractFunction(
        ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
        buildingFactoryAbi,
        "newBuilding",
        [tokenURI] 
      );

      if (txHashOrId) {
        toast.success(`Building added! IPFS: ${tokenURI}`);
        resetForm();
      } else {
        toast.error("Transaction failed or canceled.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to add building: ${err.message}`);
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Add Building</h3>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Building Name</label>
              <Field
                name="name"
                className="input input-bordered w-full"
                placeholder="Enter building name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Location</label>
              <Field
                name="location"
                className="input input-bordered w-full"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Token Supply</label>
              <Field
                name="tokenSupply"
                type="number"
                className="input input-bordered w-full"
                placeholder="Enter token supply"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Add Building
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
