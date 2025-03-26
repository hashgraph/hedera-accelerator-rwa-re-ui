import type { CreateSliceRequestBody } from "@/types/erc3643/types";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { toast } from "sonner";
import { UploadFileButton } from "@/components/ui/upload-file-button";

const initialValues = {
   name: "",
   description: "",
   endDate: "",
   sliceImageIpfsHash: "",
   symbol: "",
};

type Props = {
   isLoading: boolean;
   children: React.ReactElement;
   getSliceAllocationForm: () => void;
   submitCreateSlice: (data: CreateSliceRequestBody) => void;
};

export const AddSliceForm = ({
   submitCreateSlice,
   getSliceAllocationForm,
   isLoading,
   children,
}: Props) => {
   const { uploadImage, isPending } = useUploadImageToIpfs();

   return (
      <Formik initialValues={initialValues} onSubmit={submitCreateSlice}>
         {({ setFieldValue, getFieldProps }) => {
            return (
               <Form className="space-y-4">
                  <div>
                     <Label htmlFor="name">Slice Name</Label>
                     <Input className="mt-1" {...getFieldProps("name")} placeholder="e.g. 1" />
                  </div>
                  <div>
                     <Label htmlFor="description">Slice Description</Label>
                     <Input
                        className="mt-1"
                        {...getFieldProps("description")}
                        placeholder="e.g. 1"
                     />
                  </div>
                  <div>
                     <Label htmlFor="endDate">Slice End Date</Label>
                     <Input
                        className="mt-1"
                        {...getFieldProps("endDate")}
                        type="date"
                        placeholder="e.g. 1"
                     />
                  </div>
                  <div>
                     <Label htmlFor="sliceImageIpfsHash">Slice Image IPFS Hash</Label>
                     <div className="mt-1 flex gap-1">
                        <Input {...getFieldProps("sliceImageIpfsHash")} placeholder="e.g. /url" />

                        <UploadFileButton
                           isLoading={isPending}
                           onFileAdded={async (file) => {
                              // TODO: Implement tryCatch() for error handling when Mariana's PR is merged
                              const ipfsHash = await uploadImage(file);
                              setFieldValue("sliceImageIpfsHash", ipfsHash);
                              toast.success(`Image uploaded successfully: ${ipfsHash}`);
                           }}
                        />
                     </div>
                     <ErrorMessage name="sliceImageIpfsHash">
                        {(error) => <span className="label-text-alt text-red-700">{error}</span>}
                     </ErrorMessage>
                  </div>
                  {children}
                  <div className="flex justify-end gap-5 mt-5">
                     <Button variant="outline" onClick={getSliceAllocationForm}>
                        Add Allocation
                     </Button>
                     <Button isLoading={isLoading} type="submit">
                        Submit
                     </Button>
                  </div>
               </Form>
            );
         }}
      </Formik>
   );
};
