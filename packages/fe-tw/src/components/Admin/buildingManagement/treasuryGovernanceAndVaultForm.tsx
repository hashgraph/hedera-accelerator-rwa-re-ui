import { useFormikContext } from "formik";
import { BuildingFormProps } from "@/components/Admin/buildingManagement/types";
import { FormInput } from "@/components/ui/formInput";
import * as React from "react";

const TreasuryGovernanceAndVaultForm = () => {
   const formik = useFormikContext<BuildingFormProps>();

   return (
      <div className="grid grid-cols-2 gap-4">
         <div>
            <h2 className="text-xl font-semibold">Treasury</h2>
            <div className="grid grid-cols-1 gap-4 mt-5">
               <FormInput
                  required
                  label="Reserve"
                  {...formik.getFieldProps("treasuryAndGovernance.reserve")}
                  placeholder="e.g. 10"
                  error={
                     formik.touched?.treasuryAndGovernance?.reserve
                        ? formik.errors.treasuryAndGovernance?.reserve
                        : undefined
                  }
               />

               <FormInput
                  required
                  label="NPercentage"
                  {...formik.getFieldProps("treasuryAndGovernance.npercentage")}
                  placeholder="e.g. 10"
                  error={
                     formik.touched?.treasuryAndGovernance?.npercentage
                        ? formik.errors.treasuryAndGovernance?.npercentage
                        : undefined
                  }
               />
            </div>
         </div>

         <div>
            <h2 className="text-xl font-semibold">Governance</h2>
            <div className="grid grid-cols-1 gap-4 mt-5">
               <FormInput
                  required
                  label="Governance Name"
                  {...formik.getFieldProps("treasuryAndGovernance.governanceName")}
                  placeholder="e.g. My Governance"
                  error={
                     formik.touched?.treasuryAndGovernance?.governanceName
                        ? formik.errors.treasuryAndGovernance?.governanceName
                        : undefined
                  }
               />
            </div>
         </div>

         <div>
            <h2 className="text-xl font-semibold">Vault</h2>
            <div className="grid grid-cols-1 gap-4 mt-5">
               <FormInput
                  label="Share Token Name"
                  {...formik.getFieldProps("treasuryAndGovernance.shareTokenName")}
                  placeholder="e.g. My Share Token"
                  error={
                     formik.touched?.treasuryAndGovernance?.shareTokenName
                        ? formik.errors.treasuryAndGovernance?.shareTokenName
                        : undefined
                  }
               />
               <FormInput
                  label="Share Token Symbol"
                  {...formik.getFieldProps("treasuryAndGovernance.shareTokenSymbol")}
                  placeholder="e.g. STOK"
                  error={
                     formik.touched?.treasuryAndGovernance?.shareTokenSymbol
                        ? formik.errors.treasuryAndGovernance?.shareTokenSymbol
                        : undefined
                  }
               />

               <FormInput
                  label="Fee Receiver Address"
                  {...formik.getFieldProps("treasuryAndGovernance.feeReceiverAddress")}
                  placeholder="0x..."
                  error={
                     formik.touched?.treasuryAndGovernance?.feeReceiverAddress
                        ? formik.errors.treasuryAndGovernance?.feeReceiverAddress
                        : undefined
                  }
               />

               <FormInput
                  label={"Fee token address"}
                  {...formik.getFieldProps("treasuryAndGovernance.feeToken")}
                  placeholder="0x..."
               />

               <FormInput
                  label="Fee Percentage"
                  {...formik.getFieldProps("treasuryAndGovernance.feePercentage")}
                  placeholder="e.g. 5"
                  error={
                     formik.touched?.treasuryAndGovernance?.feePercentage
                        ? formik.errors.treasuryAndGovernance?.feePercentage
                        : undefined
                  }
               />
            </div>
         </div>

         <div>
            <h2 className="text-xl font-semibold">Auto Compounder</h2>
            <div className="grid grid-cols-1 gap-4 mt-5">
               <FormInput
                  label="Auto Compounder Token Name"
                  {...formik.getFieldProps("treasuryAndGovernance.autoCompounderTokenName")}
                  placeholder="e.g. My Auto Compounder Token"
                  error={
                     formik.touched?.treasuryAndGovernance?.autoCompounderTokenName
                        ? formik.errors.treasuryAndGovernance?.autoCompounderTokenName
                        : undefined
                  }
               />
               <FormInput
                  label="Auto Compounder Token Symbol"
                  {...formik.getFieldProps("treasuryAndGovernance.autoCompounderTokenSymbol")}
                  placeholder="e.g. ACTOK"
                  error={
                     formik.touched?.treasuryAndGovernance?.autoCompounderTokenSymbol
                        ? formik.errors.treasuryAndGovernance?.autoCompounderTokenSymbol
                        : undefined
                  }
               />
            </div>
         </div>
      </div>
   );
};

export default TreasuryGovernanceAndVaultForm;
