"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import { ContractId } from "@hashgraph/sdk";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets"; 
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";

import { uploadJsonToPinata } from "@/services/ipfsService";

interface FormValues {
  name: string;
  location: string;
  tokenSupply: number;
}

export function AddBuildingForm() {
  const { writeContract } = useWriteContract();

  async function handleSubmit(values: FormValues, { resetForm }: any) {
    try {
      const { name, location, tokenSupply } = values;

      const metadata = {
        name,
        location,
        supply: tokenSupply,
      };

      const ipfsHash = await uploadJsonToPinata(metadata);
      const finalTokenURI = `ipfs://${ipfsHash}`;

      const transactionOrHash = await writeContract({
        contractId: ContractId.fromSolidityAddress(BUILDING_FACTORY_ADDRESS),
        abi: buildingFactoryAbi,
        functionName: "newBuilding",
        args: [finalTokenURI],
        metaArgs: {
          gas: 800_000, 
        },
      });

      if (transactionOrHash) {
        toast.success(`New building created! Tx: ${transactionOrHash}`);
        resetForm();
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create new building");
    }
  }

  return (
    <div className="bg-white p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        Add Building
      </h3>

      <Formik<FormValues>
        initialValues={{
          name: "",
          location: "",
          tokenSupply: 1000000,
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4">
            {/* Building Name */}
            <div>
              <label className="block text-sm font-semibold">Building Name</label>
              <Field
                name="name"
                className="input input-bordered w-full"
                placeholder="Enter building name"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold">Location</label>
              <Field
                name="location"
                className="input input-bordered w-full"
                placeholder="Enter location"
              />
            </div>

            {/* Token Supply */}
            <div>
              <label className="block text-sm font-semibold">Token Supply</label>
              <Field
                name="tokenSupply"
                type="number"
                className="input input-bordered w-full"
                placeholder="Enter token supply"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Create Building
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

