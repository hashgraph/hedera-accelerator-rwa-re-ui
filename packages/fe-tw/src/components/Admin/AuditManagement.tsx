"use client";

import { BackButton } from "@/components/Buttons/BackButton";
import { useBuildings } from "@/hooks/useBuildings";
import { pinata } from "@/utils/pinata";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Button } from "react-daisyui";
import { toast } from "react-hot-toast";
import Select from "react-select";
import * as Yup from "yup";

interface Props {
  onBack?: () => void;
  onDone?: () => void;
}

interface AuditFormValues {
  insuranceProvider: string;
  coverageAmount: string;
  coverageStart: string;
  coverageEnd: string;
  notes?: string;
}

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

export function AuditManagementForm({ onBack, onDone }: Props) {
  const { buildings } = useBuildings();
  const [selectedBuildingAddress, setSelectedBuildingAddress] =
    useState<`0x${string}`>();

  const [loading, setLoading] = useState(false);
  const [txError, setTxError] = useState<string>();
  const [ipfsUrl, setIpfsUrl] = useState<string>();

  const initialValues: AuditFormValues = {
    insuranceProvider: "",
    coverageAmount: "",
    coverageStart: "",
    coverageEnd: "",
    notes: "",
  };

  const validationSchema = Yup.object({
    insuranceProvider: Yup.string().required("Required"),
    coverageAmount: Yup.string().required("Required"),
    coverageStart: Yup.string().required("Required"),
    coverageEnd: Yup.string().required("Required"),
    notes: Yup.string(),
  });

  const handleSubmit = async (values: AuditFormValues) => {
    try {
      if (!selectedBuildingAddress) {
        setTxError("Please select a building first.");
        return;
      }

      if (!selectedBuildingAddress.startsWith("0x")) {
        setTxError(`Invalid building address: ${selectedBuildingAddress}`);
        return;
      }

      setLoading(true);
      setTxError(undefined);
      setIpfsUrl(undefined);

      const auditData = {
        insuranceProvider: values.insuranceProvider,
        coverageAmount: values.coverageAmount,
        coverageStart: values.coverageStart,
        coverageEnd: values.coverageEnd,
        notes: values.notes || "",
      };

      const fileName = `audit-${selectedBuildingAddress}-${Date.now()}`;

      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();
      const { IpfsHash } = await pinata.upload
        .json(auditData, {
          metadata: { name: fileName },
        })
        .key(keyData.JWT);

      if (!IpfsHash) {
        throw new Error("IPFS hash is empty or undefined");
      }

      toast.success("Audit data uploaded.");

      onDone?.();
    } catch (err) {
      console.error(err);
      setTxError("Failed to upload Audit data to IPFS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(vals, { setSubmitting }) => {
        setSubmitting(false);
        handleSubmit(vals);
      }}
    >
      {({ handleSubmit, errors, touched }) => (
        <Form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 p-8 border border-gray-300"
        >
          {onBack && (
            <BackButton
              onHandlePress={() => {
                onBack();
              }}
            />
          )}

          <h3 className="text-xl font-semibold mt-5 mb-5">
            Create Audit Record (IPFS-Only)
          </h3>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="buildingAddress"
            >
              Select Building
            </label>
            <Select
              className="mt-2"
              placeholder="Choose building"
              onChange={(option) => {
                setSelectedBuildingAddress(option?.value as `0x${string}`);
              }}
              options={buildings.map((b) => ({
                value: b.address,
                label: b.title ? `${b.title} (${b.address})` : b.address,
              }))}
              styles={colourStyles}
            />
          </div>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="insuranceProvider"
            >
              Insurance Provider
            </label>
            <Field
              name="insuranceProvider"
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="e.g. MyInsurance Inc."
            />
            {errors.insuranceProvider && touched.insuranceProvider && (
              <div className="text-red-600 text-sm mt-1">
                {errors.insuranceProvider}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="coverageAmount"
            >
              Coverage Amount
            </label>
            <Field
              name="coverageAmount"
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="e.g. 1,000,000 USDC"
            />
            {errors.coverageAmount && touched.coverageAmount && (
              <div className="text-red-600 text-sm mt-1">
                {errors.coverageAmount}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="coverageStart"
            >
              Coverage Start
            </label>
            <Field
              name="coverageStart"
              type="date"
              className="input input-bordered w-full mt-2"
            />
            {errors.coverageStart && touched.coverageStart && (
              <div className="text-red-600 text-sm mt-1">
                {errors.coverageStart}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="coverageEnd"
            >
              Coverage End
            </label>
            <Field
              name="coverageEnd"
              type="date"
              className="input input-bordered w-full mt-2"
            />
            {errors.coverageEnd && touched.coverageEnd && (
              <div className="text-red-600 text-sm mt-1">
                {errors.coverageEnd}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-md font-semibold text-purple-400"
              htmlFor="notes"
            >
              Notes (optional)
            </label>
            <Field
              as="textarea"
              name="notes"
              rows={3}
              className="textarea textarea-bordered w-full mt-2"
              placeholder="Any special notes?"
            />
          </div>

          <div className="flex gap-5 mt-5">
            <Button
              className="pr-10 pl-10"
              type="submit"
              color="primary"
              loading={loading}
              disabled={loading}
            >
              Create Audit Record
            </Button>
          </div>

          {txError && (
            <div className="mt-3 text-red-600 text-sm font-medium">
              {txError}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
