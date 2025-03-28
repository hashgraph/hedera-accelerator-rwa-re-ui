"use client";

import { pinata } from "@/utils/pinata";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
         <h3 className="text-xl font-semibold mt-5 mb-5">Step 2 - COPE Metadata</h3>

         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(vals, { setSubmitting }) => {
               setSubmitting(false);
               handleSubmit(vals);
            }}
         >
            {({ getFieldProps }) => (
               <Form className="flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="copeConstructionMaterials">Construction Materials</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeConstructionMaterials")}
                           placeholder="e.g. Concrete"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeConstructionYearBuilt">Construction Year Built</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeConstructionYearBuilt")}
                           placeholder="e.g. 2010"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeConstructionRoofType">Roof Type</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeConstructionRoofType")}
                           placeholder="e.g. Flat"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeConstructionNumFloors">Floors</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeConstructionNumFloors")}
                           placeholder="e.g. 8"
                        />
                     </div>

                     {/* Occupancy */}
                     <div>
                        <Label htmlFor="copeOccupancyType">Occupancy Type</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeOccupancyType")}
                           placeholder="e.g. Residential"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeOccupancyPercentage">Occupancy Percentage</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeOccupancyPercentage")}
                           placeholder="e.g. 85"
                        />
                     </div>

                     {/* Protection */}
                     <div>
                        <Label htmlFor="copeProtectionFire">Fire</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeProtectionFire")}
                           placeholder="e.g. Fire station 2 miles away"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeProtectionSprinklers">Sprinklers</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeProtectionSprinklers")}
                           placeholder="e.g. Wet pipe system"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeProtectionSecurity">Security</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeProtectionSecurity")}
                           placeholder="e.g. 24/7 doorman"
                        />
                     </div>

                     {/* Exposure */}
                     <div>
                        <Label htmlFor="copeExposureNearbyRisks">Nearby Risks</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeExposureNearbyRisks")}
                           placeholder="e.g. Adjacent gas station"
                        />
                     </div>

                     <div>
                        <Label htmlFor="copeExposureFloodZone">Flood Zone</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("copeExposureFloodZone")}
                           placeholder="e.g. Zone X"
                        />
                     </div>
                  </div>

                  <Button className="mt-4 self-end" isLoading={isUploading} type="submit">
                     Submit COPE & Pin
                  </Button>
               </Form>
            )}
         </Formik>
      </div>
   );
}
