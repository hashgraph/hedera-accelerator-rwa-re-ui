"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Shield, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import countries from "i18n-iso-countries";
import englishLocale from "i18n-iso-countries/langs/en.json";
import { toast } from "sonner";
import { tryCatch } from "@/services/tryCatch";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { useCompliance } from "./useCompliance";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";

countries.registerLocale(englishLocale);

type CompliancesViewProps = {
   buildingId: string;
   buildingAddress: `0x${string}`;
};

const validationSchema = Yup.object({
   country: Yup.string().required("Country selection is required"),
});

export function CompliancesView({ buildingId, buildingAddress }: CompliancesViewProps) {
   const { data: evmAddress } = useEvmAddress();
   const {
      isSettingCompliance,
      isRemovingCompliance,
      addCountryCompliance,
      removeCountryCompliance,
      countryComplianceSet,
   } = useCompliance({
      buildingId,
      buildingAddress,
   });

   const countryOptions = Object.entries(countries.getNames("en", { select: "official" }))
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

   const handleAddCountryCompliance = async (values: { country: string }) => {
      const { data, error } = await tryCatch(
         addCountryCompliance(values.country, Number(countries.alpha2ToNumeric(values.country))),
      );

      if (data) {
         toast.success(
            <TxResultToastView title="Country compliance set successfully!" txSuccess={data} />,
         );
      } else if (error) {
         toast.error(
            <TxResultToastView title="Error setting country compliance" txError={error} />,
            {
               duration: Infinity,
            },
         );
      }
   };

   const handleRemoveCountryCompliance = async () => {
      if (!countryComplianceSet.countryCode) return;

      const { data, error } = await tryCatch(
         removeCountryCompliance(
            Number(countries.alpha2ToNumeric(countryComplianceSet.countryCode)),
         ),
      );

      if (data) {
         toast.success(
            <TxResultToastView title="Country compliance removed successfully!" txSuccess={data} />,
         );
      } else if (error) {
         toast.error(
            <TxResultToastView title="Error removing country compliance" txError={error} />,
            {
               duration: Infinity,
            },
         );
      }
   };

   return (
      <Card className="w-full max-w-md border-indigo-100 py-0">
         <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 py-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-100 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <CardTitle className="text-xl text-indigo-900">
                     ERC-3643 Country Compliance
                  </CardTitle>
                  <CardDescription className="text-indigo-700/70">
                     Select Country Compliance for the Building Token
                  </CardDescription>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pb-6">
            {!evmAddress && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="font-medium text-red-800">Connect wallet first</p>
               </div>
            )}

            {countryComplianceSet.isSet && (
               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <CheckCheck className="w-5 h-5 text-green-600" />
                        <div>
                           <p className="font-medium text-green-800">Country compliance is set</p>
                           <p className="text-sm text-green-700">
                              Allowed country: {countryComplianceSet.countryName} (
                              {countryComplianceSet.countryCode})
                           </p>
                        </div>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={handleRemoveCountryCompliance}
                        disabled={isRemovingCompliance}
                        isLoading={isRemovingCompliance}
                     >
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            )}

            {!countryComplianceSet.isSet && (
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                     Configure country compliance rules for this ERC-3643 security token to ensure
                     regulatory compliance for token transfers and trading.
                  </p>
               </div>
            )}

            {evmAddress && !countryComplianceSet.isSet && (
               <Formik
                  initialValues={{
                     country: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                     await handleAddCountryCompliance(values);
                     setSubmitting(false);
                     if (!isSettingCompliance) {
                        resetForm();
                     }
                  }}
               >
                  {({ setFieldValue, values, errors, touched }) => (
                     <Form className="space-y-6">
                        <div className="space-y-2">
                           <label htmlFor="country" className="text-sm font-medium text-gray-700">
                              Country Compliance
                           </label>
                           <Select
                              name="country"
                              onValueChange={(value) => setFieldValue("country", value)}
                              value={values.country}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select country for compliance" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                 {countryOptions.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                       {country.name} ({country.code})
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {touched.country && errors.country && (
                              <p className="text-sm text-red-600">{errors.country}</p>
                           )}
                        </div>

                        <Button
                           className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                           disabled={isSettingCompliance || !values.country}
                           isLoading={isSettingCompliance}
                           type="submit"
                        >
                           {isSettingCompliance
                              ? "Setting Compliance..."
                              : "Set Country Compliance"}
                        </Button>
                     </Form>
                  )}
               </Formik>
            )}
         </CardContent>
      </Card>
   );
}
