import type React from "react";
import { useFormikContext, Form } from "formik";
import { FormInput } from "@/components/ui/formInput";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import { CreateSliceFormProps, AddSliceAllocationFormProps } from "./constants";

export const AddSliceForm = () => {
   const { uploadImage, isPending } = useUploadImageToIpfs();
   const formik = useFormikContext<{
      slice: CreateSliceFormProps,
      sliceAllocation: AddSliceAllocationFormProps,
   }>();

   return (
      <Form className="grid grid-cols-2 gap-4">
         <div>
            <FormInput
               required
               label="Slice Name"
               placeholder="e.g. MySlice"
               className="mt-1"
               error={
                  formik.touched?.slice?.name ? formik.errors?.slice?.name : undefined
               }
               {...formik.getFieldProps("slice.name")}
            />
         </div>
         <div>
            <FormInput
               required
               label="Slice Token Symbol"
               placeholder="e.g. SLICE"
               className="mt-1"
               error={
                  formik.touched?.slice?.name ? formik.errors?.slice?.name : undefined
               }
               {...formik.getFieldProps("slice.symbol")}
            />
         </div>
         <div>
            <FormInput
               required
               label="Slice Description"
               placeholder="e.g. MySliceDesc"
               className="mt-1"
               error={
                  formik.touched?.slice?.description ? formik.errors?.slice?.description : undefined
               }
               {...formik.getFieldProps("slice.description")}
            />
         </div>
         <div>
            <FormInput
               required
               label="Slice End Date"
               type="date"
               placeholder="e.g. 10.05.2025"
               className="mt-1"
               error={
                  formik.touched?.slice?.endDate ? formik.errors?.slice?.endDate : undefined
               }
               {...formik.getFieldProps("slice.endDate")}
            />
         </div>
         <div className="flex gap-1 items-end w-full">
            <div className="w-full">
               <FormInput
                  label="Slice IPFS Hash"
                  placeholder="e.g. 02323x12142146t512764512763535353535353535"
                  className="mt-1"
                  required
                  error={
                     formik.touched?.slice?.sliceImageIpfsHash ? formik.errors?.slice?.sliceImageIpfsHash : undefined
                  }
                  {...formik.getFieldProps("slice.sliceImageIpfsHash")}
               />
            </div>
            <UploadFileButton
               isLoading={isPending}
               onFileAdded={async (file) => {
                  const ipfsHash = await uploadImage(file);

                  formik.setFieldValue("slice.sliceImageIpfsHash", ipfsHash);
               }}
            />
         </div>
      </Form>
   )
};
