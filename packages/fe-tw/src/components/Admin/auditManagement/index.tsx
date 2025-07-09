"use client";

import { Form, Formik } from "formik";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "sonner";
import { LucideDelete, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useBuildings } from "@/hooks/useBuildings";
import { pinata } from "@/utils/pinata";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBuildingAudit } from "@/hooks/useBuildingAudit";
import { tryCatch } from "@/services/tryCatch";
import { TxResultToastView } from "@/components/CommonViews/TxResultView";
import { AuditFormValues, initialValues, validationSchema } from "./helpers";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { TransactionExtended } from "@/types/common";
import { FormInput } from "@/components/ui/formInput";
import { Input } from "@/components/ui/input";

export function AuditManagementForm() {
   const { buildings } = useBuildings();
   const [auditorAddress, setAuditorAddress] = useState<`0x${string}`>();
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const {
      addAuditRecordMutation,
      updateAuditRecordMutation,
      addAuditorRole,
      revokeAuditRecord,
      auditDataLoading,
      auditData,
      userRoles,
      userRolesLoading,
   } = useBuildingAudit(selectedBuildingAddress!);

   const handleSubmit = async (values: AuditFormValues) => {
      const { error } = await tryCatch(
         (async () => {
            const fileName = `audit-${selectedBuildingAddress}-${Date.now()}`;
            const keyRequest = await fetch("/api/pinataKey");
            const keyData = await keyRequest.json();

            const { IpfsHash: newIpfsHash } = await pinata.upload
               .json(values, {
                  metadata: { name: fileName },
               })
               .key(keyData.JWT);

            if (!newIpfsHash) {
               toast.error("Error during uploading Audit data to IPFS", {
                  duration: Infinity,
                  closeButton: true,
               });
            }

            if (!!auditData?.recordId) {
               const { data: updateAuditRecordResult, error } = await tryCatch(
                  updateAuditRecordMutation.mutateAsync({
                     auditRecordId: auditData.recordId,
                     newAuditIPFSHash: newIpfsHash,
                  }),
               );

               if (updateAuditRecordResult) {
                  toast.success(
                     <TxResultToastView
                        title="Audit successfully updated"
                        txSuccess={updateAuditRecordResult}
                     />,
                     { duration: Infinity, closeButton: true },
                  );
               } else {
                  toast.error(
                     <TxResultToastView title="Error during submitting audit" txError={error.tx} />,
                     { duration: Infinity, closeButton: true },
                  );
               }
            } else {
               const { data: addAuditRecordResult, error } = await tryCatch<TransactionExtended>(
                  addAuditRecordMutation.mutateAsync(newIpfsHash),
               );

               if (addAuditRecordResult) {
                  toast.success(
                     <TxResultToastView
                        title="Audit successfully submitted"
                        txSuccess={addAuditRecordResult}
                     />,
                     { duration: Infinity, closeButton: true },
                  );
               } else {
                  toast.error(
                     <TxResultToastView title="Error during submitting audit" txError={error.tx} />,
                     { duration: Infinity, closeButton: true },
                  );
               }
            }
         })(),
      );

      if (error) {
         toast.error(error.message ?? "Error during submitting audit", {
            duration: Infinity,
            closeButton: true,
         });
      }
   };

   const handleAddAuditorOfSC = async () => {
      const { data, error } = await tryCatch(addAuditorRole.mutateAsync(auditorAddress!));

      if (error) {
         toast.error(
            <TxResultToastView
               title="Error during submitting audit"
               txError={error.tx}
            />,
            { duration: Infinity, closeButton: true },
         );
      } else {
         toast.success(
            <TxResultToastView title="Audit successfully submitted" txSuccess={data} />,
            { duration: Infinity, closeButton: true },
         );
      }
   };

   const handleRemoveAuditRecord = async () => {
      if (!!auditData?.recordId) {
         const { data: revokeAuditRecordResult, error } = await tryCatch(
            revokeAuditRecord.mutateAsync({
               auditRecordId: auditData.recordId,
            }),
         );

         if (revokeAuditRecordResult) {
            toast.success(
               <TxResultToastView
                  title="Audit successfully revoked"
                  txSuccess={revokeAuditRecordResult}
               />,
               { duration: Infinity, closeButton: true },
            );
         } else {
            toast.error(
               <TxResultToastView title="Error during revoking audit" txError={error.tx} />,
               { duration: Infinity, closeButton: true },
            );
         }
      }
   };

   if (auditDataLoading) {
      return <LoadingView isLoading />;
   }

   return (
      <div className="flex flex-row p-5 gap-5 mt-10">
         <Card className="py-0 w-300" variant="indigo">
            <CardHeader
               badge={
                  <Button onClick={handleRemoveAuditRecord} className="rounded-full h-10">
                     <LucideDelete />
                  </Button>
               }
               description={
                  !!auditData?.data
                     ? "Update already existed Audit record for an building without any stress."
                     : "Create new Audit record for an building without any stress."
               }
               title={!!auditData?.data ? "Update Audit Record" : "Create new Audit Record"}
            />

            <CardContent>
               <div className="mb-5 p-6">
                  <label className="font-semibold text-sm">Add new Auditor</label>
                  <div className="w-full flex flex-row items-center">
                     <Input
                        className="mt-1"
                        placeholder="e.g (0x...)"
                        onChange={(e) => {
                           setAuditorAddress(e.target.value as `0x${string}`);
                        }}
                     />
                     <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                        <PlusCircle width={40} onClick={handleAddAuditorOfSC} />
                     </div>
                  </div>
               </div>

               <Formik
                  initialValues={auditData?.data ?? initialValues}
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={(values, { setSubmitting }) => {
                     setSubmitting(false);
                     handleSubmit(values);
                  }}
               >
                  {({ getFieldProps, handleSubmit, errors, touched }) => (
                     <Form onSubmit={handleSubmit} className="flex flex-col p-6 gap-3">
                        <div className="w-full">
                           <Label htmlFor="buildingAddress">Pick an Building</Label>
                           <Select
                              name="buildingAddress"
                              onValueChange={(value) =>
                                 setSelectedBuildingAddress(value as `0x${string}`)
                              }
                              value={selectedBuildingAddress}
                           >
                              <SelectTrigger className="w-full mt-1">
                                 <SelectValue placeholder="Choose building" />
                              </SelectTrigger>
                              <SelectContent>
                                 {buildings?.map((building) => (
                                    <SelectItem
                                       key={building.address}
                                       value={building.address as string}
                                    >
                                       {building.title} ({building.address})
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="w-full">
                           <FormInput
                              label="Insurance Provider"
                              className="mt-1"
                              {...getFieldProps("insuranceProvider")}
                              placeholder="Insurance Provider"
                              error={
                                 touched?.insuranceProvider ? errors.insuranceProvider : undefined
                              }
                           />
                        </div>

                        <div className="w-full">
                           <FormInput
                              label="Coverage Amount"
                              className="mt-1"
                              {...getFieldProps("coverageAmount")}
                              placeholder="e.g. 1,000,000 USDC"
                              error={touched?.coverageAmount ? errors.coverageAmount : undefined}
                           />
                        </div>

                        <div className="w-full">
                           <FormInput
                              label="Coverage Start Date"
                              className="mt-1"
                              {...getFieldProps("coverageStart")}
                              placeholder="e.g. 1,000,000 USDC"
                              error={touched?.coverageStart ? errors.coverageStart : undefined}
                              type="date"
                           />
                           {errors.coverageStart && touched.coverageStart && (
                              <div className="text-red-600 text-sm mt-1">
                                 {errors.coverageStart}
                              </div>
                           )}
                        </div>

                        <div className="w-full">
                           <FormInput
                              label="Coverage End Date"
                              className="mt-1"
                              {...getFieldProps("coverageEnd")}
                              placeholder="e.g. 1,000,000 USDC"
                              error={touched?.coverageEnd ? errors.coverageEnd : undefined}
                              type="date"
                           />
                           {errors.coverageEnd && touched.coverageEnd && (
                              <div className="text-red-600 text-sm mt-1">{errors.coverageEnd}</div>
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
                           <Button isLoading={addAuditRecordMutation.isPending} type="submit">
                              {!!auditData?.data ? "Update Audit Record" : "Create Audit Record"}
                           </Button>
                        </div>
                     </Form>
                  )}
               </Formik>
            </CardContent>
         </Card>
         <Card className="p-10">
            <p className="text-indigo-900 text-sm">
               Submitting details about building audit in proper format to keep track of things.
            </p>
            <div className="mt-5">
               <iframe
                  width="360"
                  height="300"
                  src="https://www.youtube.com/embed/OSbS9rxcfmY?si=EPxuTeCZQ_3nZX_5"
                  title="Audit Embedded Video"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
               ></iframe>
            </div>
         </Card>
      </div>
   );
}
