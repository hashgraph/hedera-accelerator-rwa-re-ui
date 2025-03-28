"use client";

import type { AuditData } from "@/consts/audit";
import {
   getAuditRecordDetails,
   getAuditRecordIdsForBuilding,
} from "@/services/auditRegistryService";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { useEffect, useState } from "react";

export function useAuditData(buildingId: number) {
   const [data, setData] = useState<AuditData | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isError, setIsError] = useState(false);

   useEffect(() => {
      async function loadData() {
         try {
            setIsLoading(true);
            setIsError(false);

            const recordIds = await getAuditRecordIdsForBuilding(buildingId);
            if (!recordIds || recordIds.length === 0) {
               setData(null);
               return;
            }

            const latestRecordId = recordIds[recordIds.length - 1];
            const record = await getAuditRecordDetails(latestRecordId);
            const ipfsHash = record.ipfsHash;
            if (!ipfsHash) {
               setData(null);
               return;
            }

            const AuditJson = await fetchJsonFromIpfs(ipfsHash);
            setData(AuditJson as AuditData);
         } catch (err) {
            console.error("Failed to load Audit data:", err);
            setIsError(true);
         } finally {
            setIsLoading(false);
         }
      }

      loadData();
   }, [buildingId]);

   return { data, isLoading, isError };
}
