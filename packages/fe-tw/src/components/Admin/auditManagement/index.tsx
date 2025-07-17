"use client";

import { Form, Formik } from "formik";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
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
import {
   AuditFormValues,
   initialValues,
   validationSchema,
   auditTypeOptions,
   conditionRatingOptions,
   immediateActionOptions,
} from "./helpers";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { TransactionExtended } from "@/types/common";
import { FormInput } from "@/components/ui/formInput";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import { Separator } from "@/components/ui/separator";

export function AuditManagementForm() {
   const { buildings } = useBuildings();
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const [uploadingFile, setUploadingFile] = useState(false);
   const {
      addAuditRecordMutation,
      updateAuditRecordMutation,
      revokeAuditRecord,
      buildingDetailsLoaded,
      auditData,
      userRoles,
      userRolesLoading,
   } = useBuildingAudit(selectedBuildingAddress!);

   const handleFileUpload = async (
      file: File,
      setFieldValue: (field: string, value: any) => void,
   ) => {
      setUploadingFile(true);

      const { data, error } = await tryCatch(
         (async () => {
            const keyRequest = await fetch("/api/pinataKey");
            const keyData = await keyRequest.json();

            const { IpfsHash: fileIpfsHash } = await pinata.upload.file(file).key(keyData.JWT);

            return fileIpfsHash;
         })(),
      );

      if (data) {
         setFieldValue("auditReportIpfsId", data);
         setFieldValue("auditReportFile", file);
         toast.success("Audit report uploaded successfully to IPFS");
      } else {
         toast.error("Error uploading audit report to IPFS");
      }

      setUploadingFile(false);
   };

   const handleSubmit = async (values: AuditFormValues) => {
      const submissionData = {
         ...values,
         submissionDate: new Date().toISOString(),
      };

      const fileName = `audit-${selectedBuildingAddress}-${Date.now()}`;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();

      const { IpfsHash: newIpfsHash } = await pinata.upload
         .json(submissionData, {
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

   return (
      <div className="flex">
         <Card className="py-0 w-200" variant="indigo">
            <CardHeader
               description={
                  !!auditData?.data
                     ? "Update already existed Audit record for a building."
                     : "Create new Audit record for a building."
               }
               title={!!auditData?.data ? "Update Audit Record" : "Create new Audit Record"}
            />

            <CardContent>
               <Formik
                  initialValues={auditData?.data ?? initialValues}
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={(values, { setSubmitting }) => {
                     setSubmitting(false);
                     handleSubmit(values);
                  }}
               >
                  {({ getFieldProps, handleSubmit, errors, touched, setFieldValue, values }) => (
                     <Form onSubmit={handleSubmit} className="flex flex-col p-6">
                        <div className="w-full">
                           <Label htmlFor="buildingAddress">
                              Pick a Building
                              <span className="text-red-500">*</span>
                           </Label>
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

                        {buildingDetailsLoaded && (
                           <div className="flex flex-col gap-4 mt-4">
                              <Separator className="my-4" />

                              <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-indigo-900">
                                    Audit Company Information
                                 </h3>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                       label="Company Name"
                                       required
                                       {...getFieldProps("companyName")}
                                       placeholder="Audit company name"
                                       error={touched?.companyName ? errors.companyName : undefined}
                                    />

                                    <FormInput
                                       label="Auditor Name"
                                       required
                                       {...getFieldProps("auditorName")}
                                       placeholder="Lead auditor name"
                                       error={touched?.auditorName ? errors.auditorName : undefined}
                                    />
                                 </div>
                              </div>

                              <Separator className="my-4" />

                              <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-indigo-900">
                                    Audit Details
                                 </h3>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                       label="Audit Date"
                                       required
                                       {...getFieldProps("auditDate")}
                                       type="date"
                                       error={touched?.auditDate ? errors.auditDate : undefined}
                                    />

                                    <div className="w-full">
                                       <Label htmlFor="auditType">
                                          Audit Type/Purpose <span className="text-red-500">*</span>
                                       </Label>
                                       <Select
                                          name="auditType"
                                          required
                                          onValueChange={(value) =>
                                             setFieldValue("auditType", value)
                                          }
                                          value={values.auditType}
                                       >
                                          <SelectTrigger className="w-full mt-1">
                                             <SelectValue placeholder="Select audit type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {auditTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                       {errors.auditType && touched.auditType && (
                                          <div className="text-red-600 text-sm mt-1">
                                             {errors.auditType}
                                          </div>
                                       )}
                                    </div>
                                 </div>

                                 <FormInput
                                    label="Audit Reference/ID Number"
                                    required
                                    {...getFieldProps("auditReferenceId")}
                                    placeholder="e.g. AUD-2024-001"
                                    error={
                                       touched?.auditReferenceId
                                          ? errors.auditReferenceId
                                          : undefined
                                    }
                                 />

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                       label="Audit Validity From"
                                       required
                                       {...getFieldProps("auditValidityFrom")}
                                       type="date"
                                       error={
                                          touched?.auditValidityFrom
                                             ? errors.auditValidityFrom
                                             : undefined
                                       }
                                    />

                                    <FormInput
                                       label="Audit Validity To"
                                       required
                                       {...getFieldProps("auditValidityTo")}
                                       type="date"
                                       error={
                                          touched?.auditValidityTo
                                             ? errors.auditValidityTo
                                             : undefined
                                       }
                                    />
                                 </div>
                              </div>

                              <Separator className="my-4" />

                              <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-indigo-900">
                                    Summary Information
                                 </h3>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full">
                                       <Label htmlFor="overallConditionRating">
                                          Overall Condition Rating{" "}
                                          <span className="text-red-500">*</span>
                                       </Label>
                                       <Select
                                          name="overallConditionRating"
                                          required
                                          onValueChange={(value) =>
                                             setFieldValue("overallConditionRating", value)
                                          }
                                          value={values.overallConditionRating}
                                       >
                                          <SelectTrigger className="w-full mt-1">
                                             <SelectValue placeholder="Select condition rating" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {conditionRatingOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                       {errors.overallConditionRating &&
                                          touched.overallConditionRating && (
                                             <div className="text-red-600 text-sm mt-1">
                                                {errors.overallConditionRating}
                                             </div>
                                          )}
                                    </div>

                                    <div className="w-full">
                                       <Label htmlFor="immediateActionRequired">
                                          Immediate Action Required{" "}
                                          <span className="text-red-500">*</span>
                                       </Label>
                                       <Select
                                          name="immediateActionRequired"
                                          required
                                          onValueChange={(value) =>
                                             setFieldValue("immediateActionRequired", value)
                                          }
                                          value={values.immediateActionRequired}
                                       >
                                          <SelectTrigger className="w-full mt-1">
                                             <SelectValue placeholder="Select yes or no" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {immediateActionOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                       {errors.immediateActionRequired &&
                                          touched.immediateActionRequired && (
                                             <div className="text-red-600 text-sm mt-1">
                                                {errors.immediateActionRequired}
                                             </div>
                                          )}
                                    </div>
                                 </div>

                                 <FormInput
                                    label="Next Recommended Audit Date"
                                    required
                                    {...getFieldProps("nextRecommendedAuditDate")}
                                    type="date"
                                    error={
                                       touched?.nextRecommendedAuditDate
                                          ? errors.nextRecommendedAuditDate
                                          : undefined
                                    }
                                 />
                              </div>

                              <Separator className="my-4" />

                              <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-indigo-900">
                                    Document Upload
                                 </h3>

                                 <div className="w-full">
                                    <div className="flex items-end gap-4 mt-2">
                                       <FormInput
                                          required
                                          label="PDF Audit Report Upload"
                                          {...getFieldProps("auditReportIpfsId")}
                                          placeholder="IPFS hash of audit report"
                                          error={
                                             touched?.auditReportIpfsId
                                                ? errors.auditReportIpfsId
                                                : undefined
                                          }
                                       />

                                       <UploadFileButton
                                          isLoading={uploadingFile}
                                          onFileAdded={(file) =>
                                             handleFileUpload(file, setFieldValue)
                                          }
                                          className="flex-shrink-0"
                                       />
                                       {values.auditReportFile && (
                                          <span className="text-sm text-gray-600">
                                             {values.auditReportFile.name}
                                          </span>
                                       )}
                                       {values.auditReportIpfsId && !values.auditReportFile && (
                                          <span className="text-sm text-green-600">
                                             IPFS: {values.auditReportIpfsId.substring(0, 20)}...
                                          </span>
                                       )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                       Upload the complete audit report (PDF format recommended)
                                    </p>
                                    {errors.auditReportIpfsId && touched.auditReportIpfsId && (
                                       <div className="text-red-600 text-sm mt-1">
                                          {errors.auditReportIpfsId}
                                       </div>
                                    )}
                                 </div>
                              </div>

                              <Separator className="my-4" />

                              <div className="space-y-4">
                                 <h3 className="text-lg font-semibold text-indigo-900">
                                    Additional Notes
                                 </h3>

                                 <div className="w-full">
                                    <Label htmlFor="notes">Notes (optional)</Label>
                                    <Textarea
                                       rows={4}
                                       className="mt-1"
                                       placeholder="Any additional notes or observations..."
                                       {...getFieldProps("notes")}
                                    />
                                 </div>
                              </div>

                              <div className="flex justify-end gap-5 mt-6 pt-4 border-t">
                                 <Button isLoading={addAuditRecordMutation.isPending} type="submit">
                                    {!!auditData?.data
                                       ? "Update Audit Record"
                                       : "Create Audit Record"}
                                 </Button>
                              </div>
                           </div>
                        )}
                     </Form>
                  )}
               </Formik>
            </CardContent>
         </Card>
      </div>
   );
}
