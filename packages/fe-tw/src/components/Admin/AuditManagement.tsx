"use client";

import { useBuildings } from "@/hooks/useBuildings";
import { pinata } from "@/utils/pinata";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

interface Props {
   onBack?: () => void;
   onDone?: () => void;
}

interface AuditFormValues {
   insuranceProvider: string;
   coverageAmount: string;
   coverageRange: DateRange;
   notes?: string;
}

export function AuditManagementForm({ onDone }: Props) {
   const { buildings } = useBuildings();
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();

   const [loading, setLoading] = useState(false);
   const [txError, setTxError] = useState<string>();
   const [ipfsUrl, setIpfsUrl] = useState<string>();

   const initialValues: AuditFormValues = {
      insuranceProvider: "",
      coverageAmount: "",
      coverageRange: {
         from: undefined,
         to: undefined,
      },
      notes: "",
   };

   const validationSchema = Yup.object({
      insuranceProvider: Yup.string().required("Required"),
      coverageAmount: Yup.string().required("Required"),
      coverageRange: Yup.object()
         .shape({
            from: Yup.date(),
            to: Yup.date(),
         })
         .required("Required"),
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
            coverageStart: values.coverageRange.from,
            coverageEnd: values.coverageRange.to,
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
         {({ getFieldProps, setFieldValue, values, handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="p-5 space-y-4 p-8 border border-gray-300">
               <h3 className="text-xl font-semibold mt-5 mb-5">Create Audit Record (IPFS-Only)</h3>

               <div className="w-full">
                  <Label htmlFor="buildingAddress">Select Building</Label>
                  <Select
                     name="buildingAddress"
                     onValueChange={(value) => setSelectedBuildingAddress(value)}
                     value={selectedBuildingAddress}
                  >
                     <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Choose building" />
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
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                     className="mt-1"
                     {...getFieldProps("insuranceProvider")}
                     placeholder="e.g. MyInsurance Inc."
                  />
                  {errors.insuranceProvider && touched.insuranceProvider && (
                     <div className="text-red-600 text-sm mt-1">{errors.insuranceProvider}</div>
                  )}
               </div>

               <div className="w-full">
                  <Label htmlFor="coverageAmount">Coverage Amount</Label>
                  <Input
                     className="mt-1"
                     type="text"
                     {...getFieldProps("coverageAmount")}
                     placeholder="e.g. 1,000,000 USDC"
                  />
                  {errors.coverageAmount && touched.coverageAmount && (
                     <div className="text-red-600 text-sm mt-1">{errors.coverageAmount}</div>
                  )}
               </div>

               <div className="w-full">
                  <Label htmlFor="coverageRange">Coverage Dates</Label>

                  <DateRangePicker
                     className="mt-1"
                     value={values.coverageRange}
                     onChange={(dateRange) => setFieldValue("coverageRange", dateRange)}
                  />
                  {errors.coverageRange && touched.coverageRange && (
                     <div className="text-red-600 text-sm mt-1">{errors.coverageRange}</div>
                  )}
               </div>

               <div className="w-full">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                     rows={3}
                     className="mt-1"
                     placeholder="Any special notes?"
                     {...getFieldProps("notes")}
                  />
               </div>

               <div className="flex justify-end gap-5 mt-5">
                  <Button isLoading={loading} type="submit">
                     Create Audit Record
                  </Button>
               </div>

               {txError && <div className="mt-3 text-red-600 text-sm font-medium">{txError}</div>}
            </Form>
         )}
      </Formik>
   );
}
