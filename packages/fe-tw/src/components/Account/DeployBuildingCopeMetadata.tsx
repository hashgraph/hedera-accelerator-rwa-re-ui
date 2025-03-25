"use client";

import { pinata } from "@/utils/pinata";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

interface DeployBuildingCopeMetadataProps {
   basicData: BuildingData;
   onCopeDeployed: (ipfsHash: string) => void;
   onBack?: () => void;
}

interface BuildingData {
   buildingTitle: string;
   buildingDescription?: string;
   buildingPurchaseDate?: string;
   buildingImageIpfsId: string;
   buildingConstructedYear?: string;
   buildingType?: string;
   buildingLocation?: string;
   buildingLocationType?: string;
   buildingTokenSupply: number;
}

interface CopeFormValues {
   copeConstructionMaterials: string;
   copeConstructionYearBuilt: string;
   copeConstructionRoofType: string;
   copeConstructionNumFloors: string;
   copeOccupancyType: string;
   copeOccupancyPercentage: string;
   copeProtectionFire: string;
   copeProtectionSprinklers: string;
   copeProtectionSecurity: string;
   copeExposureNearbyRisks: string;
   copeExposureFloodZone: string;
}

const initialValues: CopeFormValues = {
   copeConstructionMaterials: "",
   copeConstructionYearBuilt: "",
   copeConstructionRoofType: "",
   copeConstructionNumFloors: "",
   copeOccupancyType: "",
   copeOccupancyPercentage: "",
   copeProtectionFire: "",
   copeProtectionSprinklers: "",
   copeProtectionSecurity: "",
   copeExposureNearbyRisks: "",
   copeExposureFloodZone: "",
};

const validationSchema = Yup.object({
   copeConstructionMaterials: Yup.string(),
   copeConstructionYearBuilt: Yup.string(),
   copeConstructionRoofType: Yup.string(),
   copeConstructionNumFloors: Yup.string(),
   copeOccupancyType: Yup.string(),
   copeOccupancyPercentage: Yup.string(),
   copeProtectionFire: Yup.string(),
   copeProtectionSprinklers: Yup.string(),
   copeProtectionSecurity: Yup.string(),
   copeExposureNearbyRisks: Yup.string(),
   copeExposureFloodZone: Yup.string(),
});

export function DeployBuildingCopeMetadata({
   basicData,
   onCopeDeployed,
   onBack,
}: DeployBuildingCopeMetadataProps) {
   const [isUploading, setIsUploading] = React.useState(false);

   async function handleSubmit(values: CopeFormValues) {
      setIsUploading(true);
      try {
         const finalJson = {
            name: basicData.buildingTitle,
            description: basicData.buildingDescription,
            image: basicData.buildingImageIpfsId,
            purchasedAt: basicData.buildingPurchaseDate,
            attributes: [
               {
                  trait_type: "constructedYear",
                  value: basicData.buildingConstructedYear,
               },
               { trait_type: "type", value: basicData.buildingType },
               { trait_type: "location", value: basicData.buildingLocation },
               { trait_type: "locationType", value: basicData.buildingLocationType },
               {
                  trait_type: "tokenSupply",
                  value: basicData.buildingTokenSupply.toString(),
               },
            ],
            cope: {
               construction: {
                  materials: values.copeConstructionMaterials,
                  yearBuilt: values.copeConstructionYearBuilt,
                  roofType: values.copeConstructionRoofType,
                  numFloors: values.copeConstructionNumFloors,
               },
               occupancy: {
                  type: values.copeOccupancyType,
                  percentageOccupied: values.copeOccupancyPercentage,
               },
               protection: {
                  fire: values.copeProtectionFire,
                  sprinklers: values.copeProtectionSprinklers,
                  security: values.copeProtectionSecurity,
               },
               exposure: {
                  nearbyRisks: values.copeExposureNearbyRisks,
                  floodZone: values.copeExposureFloodZone,
               },
            },
         };

         const sanitizedBuildingName = basicData.buildingTitle.replace(/\s+/g, "-").toLowerCase();

         const keyRequest = await fetch("/api/pinataKey");
         const keyData = await keyRequest.json();
         const { IpfsHash } = await pinata.upload
            .json(finalJson, {
               metadata: { name: `Building-${sanitizedBuildingName}` },
            })
            .key(keyData.JWT);

         onCopeDeployed(IpfsHash);
         toast.success(`Metadata pinned: ${IpfsHash}`, {
            style: { maxWidth: "unset" },
         });
      } catch (e: unknown) {
         if (e instanceof Error) {
            toast.error("Failed to upload metadata with COPE data");
         } else {
            toast.error("An unexpected error occurred");
         }
      } finally {
         setIsUploading(false);
      }
   }

   return (
      <div className="bg-white rounded-lg p-8 border border-gray-300">
         {/*{onBack && (*/}
         {/*	<Button*/}
         {/*		type="button"*/}
         {/*		onClick={onBack}*/}
         {/*		color="secondary"*/}
         {/*		className="mb-4"*/}
         {/*	>*/}
         {/*		Back*/}
         {/*	</Button>*/}
         {/*)}*/}

         <h3 className="text-xl font-semibold mt-5 mb-5">Step 2 - COPE Metadata</h3>

         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(vals, { setSubmitting }) => {
               setSubmitting(false);
               handleSubmit(vals);
            }}
         >
            {() => (
               <Form className="space-y-4">
                  {/* Construction */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400"
                        htmlFor="copeConstructionMaterials"
                     >
                        Construction Materials
                     </label>
                     <Field
                        name="copeConstructionMaterials"
                        className="input w-full mt-2"
                        placeholder="e.g. Concrete"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeConstructionYearBuilt"
                     >
                        Construction Year Built
                     </label>
                     <Field
                        name="copeConstructionYearBuilt"
                        className="input w-full mt-2"
                        placeholder="e.g. 2010"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeConstructionRoofType"
                     >
                        Roof Type
                     </label>
                     <Field
                        name="copeConstructionRoofType"
                        className="input w-full mt-2"
                        placeholder="e.g. Flat"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeConstructionNumFloors"
                     >
                        Floors
                     </label>
                     <Field
                        name="copeConstructionNumFloors"
                        className="input w-full mt-2"
                        placeholder="e.g. 8"
                     />
                  </div>

                  {/* Occupancy */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-6"
                        htmlFor="copeOccupancyType"
                     >
                        Occupancy Type
                     </label>
                     <Field
                        name="copeOccupancyType"
                        className="input w-full mt-2"
                        placeholder="e.g. Residential"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeOccupancyPercentage"
                     >
                        Occupancy Percentage
                     </label>
                     <Field
                        name="copeOccupancyPercentage"
                        className="input w-full mt-2"
                        placeholder="e.g. 85"
                     />
                  </div>

                  {/* Protection */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-6"
                        htmlFor="copeProtectionFire"
                     >
                        Fire
                     </label>
                     <Field
                        name="copeProtectionFire"
                        className="input w-full mt-2"
                        placeholder="e.g. Fire station 2 miles away"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeProtectionSprinklers"
                     >
                        Sprinklers
                     </label>
                     <Field
                        name="copeProtectionSprinklers"
                        className="input w-full mt-2"
                        placeholder="e.g. Wet pipe system"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeProtectionSecurity"
                     >
                        Security
                     </label>
                     <Field
                        name="copeProtectionSecurity"
                        className="input w-full mt-2"
                        placeholder="e.g. 24/7 doorman"
                     />
                  </div>

                  {/* Exposure */}
                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-6"
                        htmlFor="copeExposureNearbyRisks"
                     >
                        Nearby Risks
                     </label>
                     <Field
                        name="copeExposureNearbyRisks"
                        className="input w-full mt-2"
                        placeholder="e.g. Adjacent gas station"
                     />
                  </div>

                  <div>
                     <label
                        className="block text-md font-semibold text-purple-400 mt-4"
                        htmlFor="copeExposureFloodZone"
                     >
                        Flood Zone
                     </label>
                     <Field
                        name="copeExposureFloodZone"
                        className="input w-full mt-2"
                        placeholder="e.g. Zone X"
                     />
                  </div>

                  <button className="btn btn-primary mt-8" type="submit">
                     {isUploading ? (
                        <span className="loading loading-spinner" />
                     ) : (
                        "Submit COPE & Pin"
                     )}
                  </button>
               </Form>
            )}
         </Formik>
      </div>
   );
}
