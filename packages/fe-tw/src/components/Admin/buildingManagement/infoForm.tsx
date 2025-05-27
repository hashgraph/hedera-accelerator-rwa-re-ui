import { useFormikContext } from "formik";
import { FormInput } from "@/components/ui/formInput";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import * as React from "react";
import { BuildingFormProps } from "./types";
import { cn } from "@/lib/utils";

const BuildingInfoForm = () => {
   const formik = useFormikContext<BuildingFormProps>();

   return (
      <div className={cn("grid grid-cols-1 gap-4")}>
         <div className="relative">
            <h2 className="text-xl font-semibold">Building</h2>
            <div className="grid grid-cols-2 gap-4 mt-5">
               <div className="flex flex-col gap-1 w-full">
                  <div className="flex gap-2 items-end">
                     <FormInput
                        required
                        disabled={!!formik.values.info.buildingImageIpfsFile}
                        label={"Building Image IPFS Id"}
                        {...formik.getFieldProps("info.buildingImageIpfsId")}
                        placeholder="QmXYZ..."
                     />
                     <UploadFileButton
                        onFileAdded={async (file) => {
                           formik.setFieldValue("info.buildingImageIpfsFile", file);
                        }}
                     />
                  </div>
               </div>

               <FormInput
                  required
                  label={"Building Title"}
                  {...formik.getFieldProps("info.buildingTitle")}
                  placeholder="e.g. My Building"
                  error={
                     formik.touched?.info?.buildingTitle
                        ? formik.errors.info?.buildingTitle
                        : undefined
                  }
               />

               <FormInput
                  required
                  label={"Building Token Supply"}
                  type="number"
                  {...formik.getFieldProps("info.buildingTokenSupply")}
                  placeholder="e.g. 1000000"
                  error={
                     formik.touched?.info?.buildingTokenSupply
                        ? formik.errors.info?.buildingTokenSupply
                        : undefined
                  }
               />

               <FormInput
                  label={"Building Description"}
                  {...formik.getFieldProps("info.buildingDescription")}
                  placeholder="A short description"
                  error={
                     formik.touched?.info?.buildingDescription
                        ? formik.errors.info?.buildingDescription
                        : undefined
                  }
               />

               <FormInput
                  label={"Building Purchase Date"}
                  {...formik.getFieldProps("info.buildingPurchaseDate")}
                  placeholder="YYYY-MM-DD"
                  error={
                     formik.touched?.info?.buildingPurchaseDate
                        ? formik.errors.info?.buildingPurchaseDate
                        : undefined
                  }
               />

               <FormInput
                  label={"Building Constructed Year"}
                  {...formik.getFieldProps("info.buildingConstructedYear")}
                  placeholder="YYYY"
                  error={
                     formik.touched?.info?.buildingConstructedYear
                        ? formik.errors.info?.buildingConstructedYear
                        : undefined
                  }
               />

               <FormInput
                  label={"Building Type"}
                  {...formik.getFieldProps("info.buildingType")}
                  placeholder="e.g. Residential"
                  error={
                     formik.touched?.info?.buildingType
                        ? formik.errors.info?.buildingType
                        : undefined
                  }
               />
               <FormInput
                  label={"Building Location"}
                  {...formik.getFieldProps("info.buildingLocation")}
                  placeholder="e.g. New York City"
                  error={
                     formik.touched?.info?.buildingLocation
                        ? formik.errors.info?.buildingLocation
                        : undefined
                  }
               />
               <FormInput
                  label={"Building Location Type"}
                  {...formik.getFieldProps("info.buildingLocationType")}
                  placeholder="e.g. Urban"
                  error={
                     formik.touched?.info?.buildingLocationType
                        ? formik.errors.info?.buildingLocationType
                        : undefined
                  }
               />
            </div>
         </div>

         <div>
            <h2 className="text-xl font-semibold mt-5">COPE Information</h2>
            <div className="grid grid-cols-2 gap-4 mt-5">
               <FormInput
                  label={"Construction Materials"}
                  {...formik.getFieldProps("info.copeConstructionMaterials")}
                  placeholder="e.g. Concrete"
                  error={
                     formik.touched?.info?.copeConstructionMaterials
                        ? formik.errors.info?.copeConstructionMaterials
                        : undefined
                  }
               />
               <FormInput
                  label={"Construction Year Built"}
                  {...formik.getFieldProps("info.copeConstructionYearBuilt")}
                  placeholder="e.g. 2010"
                  error={
                     formik.touched?.info?.copeConstructionYearBuilt
                        ? formik.errors.info?.copeConstructionYearBuilt
                        : undefined
                  }
               />
               <FormInput
                  label={"Roof Type"}
                  {...formik.getFieldProps("info.copeConstructionRoofType")}
                  placeholder="e.g. Flat"
                  error={
                     formik.touched?.info?.copeConstructionRoofType
                        ? formik.errors.info?.copeConstructionRoofType
                        : undefined
                  }
               />
               <FormInput
                  label={"Floors"}
                  {...formik.getFieldProps("info.copeConstructionNumFloors")}
                  placeholder="e.g. 8"
                  error={
                     formik.touched?.info?.copeConstructionNumFloors
                        ? formik.errors.info?.copeConstructionNumFloors
                        : undefined
                  }
               />
               <FormInput
                  label={"Occupancy Type"}
                  {...formik.getFieldProps("info.copeOccupancyType")}
                  placeholder="e.g. Residential"
                  error={
                     formik.touched?.info?.copeOccupancyType
                        ? formik.errors.info?.copeOccupancyType
                        : undefined
                  }
               />
               <FormInput
                  label={"Occupancy Percentage"}
                  {...formik.getFieldProps("info.copeOccupancyPercentage")}
                  placeholder="e.g. 85"
                  error={
                     formik.touched?.info?.copeOccupancyPercentage
                        ? formik.errors.info?.copeOccupancyPercentage
                        : undefined
                  }
               />
               <FormInput
                  label={"Fire Protection"}
                  {...formik.getFieldProps("info.copeProtectionFire")}
                  placeholder="e.g. Yes"
                  error={
                     formik.touched?.info?.copeProtectionFire
                        ? formik.errors.info?.copeProtectionFire
                        : undefined
                  }
               />
               <FormInput
                  label={"Sprinkles"}
                  {...formik.getFieldProps("info.copeProtectionSprinklers")}
                  placeholder="e.g. Wet pipe system"
                  error={
                     formik.touched?.info?.copeProtectionFire
                        ? formik.errors.info?.copeProtectionFire
                        : undefined
                  }
               />

               <FormInput
                  label="Security"
                  {...formik.getFieldProps("info.copeProtectionSecurity")}
                  placeholder="e.g. 24/7 doorman"
                  error={
                     formik.touched?.info?.copeProtectionSecurity
                        ? formik.errors.info?.copeProtectionSecurity
                        : undefined
                  }
               />
               <FormInput
                  label="Nearby Risks"
                  {...formik.getFieldProps("info.copeExposureNearbyRisks")}
                  placeholder="e.g. Adjacent gas station"
                  error={
                     formik.touched?.info?.copeExposureNearbyRisks
                        ? formik.errors.info?.copeExposureNearbyRisks
                        : undefined
                  }
               />
               <FormInput
                  label="Flood Zone"
                  {...formik.getFieldProps("info.copeExposureFloodZone")}
                  placeholder="e.g. Zone X"
                  error={
                     formik.touched?.info?.copeExposureFloodZone
                        ? formik.errors.info?.copeExposureFloodZone
                        : undefined
                  }
               />
            </div>
         </div>
      </div>
   );
};

export default BuildingInfoForm;
