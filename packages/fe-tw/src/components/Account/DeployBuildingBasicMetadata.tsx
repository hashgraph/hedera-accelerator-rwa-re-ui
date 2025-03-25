"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";

import { UploadImageForm } from "@/components/Account/UploadImageForm";

export interface NewBuildingFormProps {
   buildingTitle: string;
   buildingDescription?: string;
   buildingPurchaseDate?: string;
   buildingImageIpfsId: string;
   buildingImageIpfsFile?: File;
   buildingConstructedYear?: string;
   buildingType?: string;
   buildingLocation?: string;
   buildingLocationType?: string;
   buildingTokenSupply: number;
}

const newBuildingFormInitialValues: NewBuildingFormProps = {
   buildingTitle: "",
   buildingDescription: "",
   buildingPurchaseDate: "",
   buildingImageIpfsId: "",
   buildingImageIpfsFile: undefined,
   buildingConstructedYear: "",
   buildingType: "",
   buildingLocation: "",
   buildingLocationType: "",
   buildingTokenSupply: 1000000,
};

interface DeployBuildingMetadataProps {
   /** Called after user submits basic building data.
    * e.g. (formValues: NewBuildingFormProps) => void */
   onBasicMetadataComplete: (formValues: NewBuildingFormProps) => void;
   setDeployStep: (stepId: number) => void;
}

/**
 * This component is a single step that collects the building's
 * basic fields + an upload image form. You can adapt it to pass
 * the pinned IPFS hash up, or simply pass raw data.
 */
export function DeployBuildingBasicMetadata({
   onBasicMetadataComplete,
   setDeployStep,
}: DeployBuildingMetadataProps) {
   const [isSubmitting, setIsSubmitting] = React.useState(false);

   const validationSchema = Yup.object({
      buildingTitle: Yup.string().required("Required"),
   });

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         <h3 className="text-xl font-semibold mb-5">Step 1 - Add Building Metadata</h3>

         <Formik
            initialValues={newBuildingFormInitialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
               setIsSubmitting(true);

               onBasicMetadataComplete(values);
               setSubmitting(false);
               setIsSubmitting(false);
            }}
         >
            {({ values, setFieldValue }) => (
               <Form className="space-y-4">
                  {/* Title */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400"
                        htmlFor="buildingTitle"
                     >
                        Building title
                     </label>
                     <Field
                        name="buildingTitle"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. My Building"
                     />
                     <ErrorMessage
                        name="buildingTitle"
                        render={(msg) => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                     />
                  </div>

                  {/* Description */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingDescription"
                     >
                        Building description
                     </label>
                     <Field
                        as="textarea"
                        name="buildingDescription"
                        className="textarea textarea-bordered w-full mt-2"
                        placeholder="A short description"
                     />
                  </div>

                  {/* Purchase Date */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingPurchaseDate"
                     >
                        Building purchase date
                     </label>
                     <Field
                        name="buildingPurchaseDate"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. 2021-12-31"
                     />
                  </div>

                  {/* buildingImageIpfsId */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingImageIpfsId"
                     >
                        Building image IPFS Id
                     </label>
                     <Field
                        name="buildingImageIpfsId"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="QmXYZ..."
                     />
                  </div>

                  {/* The UploadImageForm for optional file uploading */}
                  <div className="mt-4">
                     <UploadImageForm
                        onFileUploaded={(file, cid) => {
                           // If your UploadImageForm returns a Pinata CID, store it
                           setFieldValue("buildingImageIpfsFile", file);
                           setFieldValue("buildingImageIpfsId", cid);
                        }}
                     />
                  </div>

                  {/* Constructed Year */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingConstructedYear"
                     >
                        Building year of construction
                     </label>
                     <Field
                        name="buildingConstructedYear"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. 1990"
                     />
                  </div>

                  {/* Building Type */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingType"
                     >
                        Building type
                     </label>
                     <Field
                        name="buildingType"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. Residential"
                     />
                  </div>

                  {/* Building Location */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingLocation"
                     >
                        Building location
                     </label>
                     <Field
                        name="buildingLocation"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. New York City"
                     />
                  </div>

                  {/* Building Location Type */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingLocationType"
                     >
                        Building location type
                     </label>
                     <Field
                        name="buildingLocationType"
                        type="text"
                        className="input w-full mt-2"
                        placeholder="e.g. Urban"
                     />
                  </div>

                  {/* Token Supply */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="buildingTokenSupply"
                     >
                        Token Supply
                     </label>
                     <Field
                        name="buildingTokenSupply"
                        type="number"
                        className="input w-full mt-2"
                        placeholder="1000000"
                     />
                  </div>
                  <div className="flex gap-5 mt-10">
                     <button
                        className="btn btn-accent"
                        type="button"
                        onClick={() => {
                           setDeployStep(6);
                        }}
                     >
                        Deploy A Token
                     </button>
                     <button className="btn btn-primary" type="submit">
                        {isSubmitting ? <span className="loading loading-spinner" /> : "Next"}
                     </button>
                  </div>
               </Form>
            )}
         </Formik>
      </div>
   );
}
