"use client";

import { ErrorMessage, Form, Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import { useUploadImageToIpfs } from "@/hooks/useUploadImageToIpfs";
import { Button } from "@/components/ui/button";

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
   const { uploadImage, isPending } = useUploadImageToIpfs();

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
            {({ values, setFieldValue, getFieldProps }) => (
               <Form className="grid grid-cols-2 gap-4">
                  <div>
                     <Label htmlFor="buildingTitle">Building title</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingTitle")}
                        placeholder="e.g. My Building"
                     />
                     <ErrorMessage
                        name="buildingTitle"
                        render={(msg) => <div className="text-red-600 text-sm mt-1">{msg}</div>}
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingDescription">Building description</Label>
                     <Textarea
                        className="mt-1"
                        {...getFieldProps("buildingDescription")}
                        placeholder="A short description"
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingPurchaseDate">Building purchase date</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingPurchaseDate")}
                        placeholder="e.g. 2021-12-31"
                     />
                  </div>

                  <div className="flex gap-1 items-end w-full">
                     <div className="w-full">
                        <Label htmlFor="buildingImageIpfsId">Building image IPFS Id</Label>
                        <Input
                           className="mt-1"
                           type="text"
                           {...getFieldProps("buildingImageIpfsId")}
                           placeholder="QmXYZ..."
                        />
                     </div>
                     <UploadFileButton
                        isLoading={isPending}
                        onFileAdded={async (file) => {
                           // TODO: Implement tryCatch() for error handling when Mariana's PR is merged
                           const ipfsHash = await uploadImage(file);
                           setFieldValue("buildingImageIpfsId", ipfsHash);
                           setFieldValue("buildingImageIpfsFile", file);

                           toast.success(`Image uploaded successfully: ${ipfsHash}`);
                        }}
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingConstructedYear">Building year of construction</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingConstructedYear")}
                        placeholder="e.g. 1990"
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingType">Building type</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingType")}
                        placeholder="e.g. Residential"
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingLocation">Building location</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingLocation")}
                        placeholder="e.g. New York City"
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingLocationType">Building location type</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        {...getFieldProps("buildingLocationType")}
                        placeholder="e.g. Urban"
                     />
                  </div>

                  <div>
                     <Label htmlFor="buildingTokenSupply">Token Supply</Label>
                     <Input
                        className="mt-1"
                        type="number"
                        {...getFieldProps("buildingTokenSupply")}
                        placeholder="1000000"
                     />
                  </div>
                  <div className="flex justify-end gap-5 mt-10">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                           setDeployStep(6);
                        }}
                     >
                        Deploy A Token
                     </Button>
                     <Button isLoading={isSubmitting} type="submit">
                        Submit and Continue
                     </Button>
                  </div>
               </Form>
            )}
         </Formik>
      </div>
   );
}
