import { UploadImageForm } from "@/components/Account/UploadImageForm";
import type { CreateSliceRequestBody } from "@/types/erc3643/types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type React from "react";

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
   return (
      <Formik initialValues={initialValues} onSubmit={submitCreateSlice}>
         {({ setFieldValue }) => {
            return (
               <Form className="space-y-4">
                  <div>
                     <label className="block text-md font-semibold text-purple-400" htmlFor="name">
                        Slice Name
                     </label>
                     <Field name="name" className="input w-full mt-2" placeholder="e.g. 1" />
                  </div>
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400"
                        htmlFor="description"
                     >
                        Slice Description
                     </label>
                     <Field name="description" className="input w-full mt-2" placeholder="e.g. 1" />
                  </div>
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400"
                        htmlFor="endDate"
                     >
                        Slice End Date
                     </label>
                     <Field
                        name="endDate"
                        className="input w-full mt-2"
                        placeholder="e.g. 1"
                        type="date"
                     />
                  </div>
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400"
                        htmlFor="sliceImageIpfsHash"
                     >
                        Slice Image IPFS Hash
                     </label>
                     <ErrorMessage name="sliceImageIpfsHash">
                        {(error) => <span className="label-text-alt text-red-700">{error}</span>}
                     </ErrorMessage>
                     <Field
                        name="sliceImageIpfsHash"
                        className="input w-full mt-2"
                        placeholder="e.g. /url"
                     />
                     <UploadImageForm
                        fileHashIpfsId="sliceImageIpfsId"
                        fileHashIpfsName="sliceImageIpfsHash"
                        onFileUploaded={(file, cid) => {
                           console.log(file, cid);
                           setFieldValue("sliceImageIpfsHash", cid);
                        }}
                     />
                  </div>
                  {children}
                  <div className="flex gap-5 mt-5">
                     <button className="btn btn-primary pr-20 pl-20" type="submit">
                        {isLoading ? (
                           <>
                              <span className="loading loading-spinner" />
                              &nbsp;In Progress...
                           </>
                        ) : (
                           "Submit"
                        )}
                     </button>
                     <button
                        className="btn pr-20 pl-20"
                        type="button"
                        onClick={getSliceAllocationForm}
                     >
                        {isLoading ? (
                           <>
                              <span className="loading loading-spinner" />
                              &nbsp;In Progress...
                           </>
                        ) : (
                           "Add Allocation"
                        )}
                     </button>
                  </div>
               </Form>
            );
         }}
      </Formik>
   );
};
