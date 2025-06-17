"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { tokenVotesAbi } from "@/services/contracts/abi/tokenVotesAbi";
import useWriteContract from "@/hooks/useWriteContract";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { tryCatch } from "@/services/tryCatch";
import { modularComplianceAbi } from "@/services/contracts/abi/modularComplianceAbi";
import { COMPLIANCE_MODULE_ADDRESSES } from "@/services/contracts/addresses";
import { ContractId } from "@hashgraph/sdk";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { countryAllowModuleAbi } from "@/services/contracts/abi/countryAllowModuleAbi";
import countries from "i18n-iso-countries";
import englishLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(englishLocale);

type ComplianceHookParams = {
   buildingId: string;
   buildingAddress: `0x${string}`;
};

export const useCompliance = ({ buildingId, buildingAddress }: ComplianceHookParams) => {
   const { writeContract } = useWriteContract();
   const { tokenAddress } = useBuildingInfo(buildingAddress);
   const { complianceAddress } = useTokenInfo(tokenAddress);
   const { executeTransaction } = useExecuteTransaction();

   const [isSettingCompliance, setIsSettingCompliance] = useState(false);
   const [isRemovingCompliance, setIsRemovingCompliance] = useState(false);
   const [countryComplianceSet, setCountryComplianceSet] = useState<{
      isSet: boolean;
      countryName?: string;
      countryCode?: string;
   }>({ isSet: false });

   useEffect(() => {
      if (!complianceAddress) return;

      // Track events for the specific compliance address
      const eventCounts = new Map<string, { allowed: number; unallowed: number }>();

      const unwatchAllowed = watchContractEvent({
         address: COMPLIANCE_MODULE_ADDRESSES.COUNTRY_ALLOW_MODULE,
         abi: countryAllowModuleAbi,
         eventName: "CountryAllowed",
         onLogs: (logs) => {
            console.log("CountryAllowed logs :>> ", logs);
            const relevantLogs = logs.filter((log) => log.args[0] === complianceAddress);

            relevantLogs.forEach((log) => {
               const countryIsoNumber = log.args[1].toString().padStart(3, "0");
               const key = `${complianceAddress}-${countryIsoNumber}`;

               const counts = eventCounts.get(key) || { allowed: 0, unallowed: 0 };
               counts.allowed += 1;
               eventCounts.set(key, counts);

               // Determine final state: if allowed count > unallowed count, country is allowed
               const isAllowed = counts.allowed > counts.unallowed;

               if (isAllowed) {
                  const countryCode = countries.numericToAlpha2(countryIsoNumber);
                  const countryName = countryCode
                     ? countries.getName(countryCode, "en")
                     : "Unknown";

                  setCountryComplianceSet({
                     isSet: true,
                     countryName,
                     countryCode,
                  });
               } else {
                  setCountryComplianceSet({
                     isSet: false,
                     countryName: undefined,
                     countryCode: undefined,
                  });
               }
            });
         },
      });

      const unwatchUnallowed = watchContractEvent({
         address: COMPLIANCE_MODULE_ADDRESSES.COUNTRY_ALLOW_MODULE,
         abi: countryAllowModuleAbi,
         eventName: "CountryUnallowed",
         onLogs: (logs) => {
            console.log("CountryUnallowed logs :>> ", logs);
            const relevantLogs = logs.filter((log) => log.args[0] === complianceAddress);

            relevantLogs.forEach((log) => {
               const countryIsoNumber = log.args[1].toString().padStart(3, "0");
               const key = `${complianceAddress}-${countryIsoNumber}`;

               const counts = eventCounts.get(key) || { allowed: 0, unallowed: 0 };
               counts.unallowed += 1;
               eventCounts.set(key, counts);

               // Determine final state: if allowed count > unallowed count, country is allowed
               const isAllowed = counts.allowed > counts.unallowed;

               if (isAllowed) {
                  const countryCode = countries.numericToAlpha2(countryIsoNumber);
                  const countryName = countryCode
                     ? countries.getName(countryCode, "en")
                     : "Unknown";

                  setCountryComplianceSet({
                     isSet: true,
                     countryName,
                     countryCode,
                  });
               } else {
                  setCountryComplianceSet({
                     isSet: false,
                     countryName: undefined,
                     countryCode: undefined,
                  });
               }
            });
         },
      });

      return () => {
         unwatchAllowed();
         unwatchUnallowed();
      };
   }, [complianceAddress]);

   const addComplianceMutation = useMutation({
      mutationFn: async ({
         country,
         countryIsoNumber,
      }: {
         country: string;
         countryIsoNumber: number;
      }) => {
         setIsSettingCompliance(true);

         const callData = new ethers.Interface([
            "function addAllowedCountry(uint16)",
         ]).encodeFunctionData("addAllowedCountry", [countryIsoNumber]);

         // const addModuleTX = await executeTransaction(() =>
         //    writeContract({
         //       contractId: ContractId.fromEvmAddress(0, 0, complianceAddress),
         //       abi: modularComplianceAbi,
         //       functionName: "addModule",
         //       args: [COMPLIANCE_MODULE_ADDRESSES.COUNTRY_ALLOW_MODULE],
         //    }),
         // );

         const callModuleFunctionTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, complianceAddress),
               abi: modularComplianceAbi,
               functionName: "callModuleFunction",
               args: [callData, COMPLIANCE_MODULE_ADDRESSES.COUNTRY_ALLOW_MODULE],
            }),
         );

         setIsSettingCompliance(false);

         return {
            addModuleTX,
            callModuleFunctionTx,
         };
      },
   });

   const removeComplianceMutation = useMutation({
      mutationFn: async ({ countryIsoNumber }: { countryIsoNumber: number }) => {
         setIsRemovingCompliance(true);

         const callData = new ethers.Interface([
            "function removeAllowedCountry(uint16)",
         ]).encodeFunctionData("removeAllowedCountry", [countryIsoNumber]);

         const callModuleFunctionTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, complianceAddress),
               abi: modularComplianceAbi,
               functionName: "callModuleFunction",
               args: [callData, COMPLIANCE_MODULE_ADDRESSES.COUNTRY_ALLOW_MODULE],
            }),
         );

         setIsRemovingCompliance(false);

         return {
            callModuleFunctionTx,
         };
      },
   });

   const addCountryCompliance = async (country: string, countryIsoNumber: number) => {
      return addComplianceMutation.mutateAsync({ country, countryIsoNumber });
   };

   const removeCountryCompliance = async (countryIsoNumber: number) => {
      return removeComplianceMutation.mutateAsync({ countryIsoNumber });
   };

   return {
      isSettingCompliance,
      isRemovingCompliance,
      addCountryCompliance,
      removeCountryCompliance,
      countryComplianceSet,
   };
};
