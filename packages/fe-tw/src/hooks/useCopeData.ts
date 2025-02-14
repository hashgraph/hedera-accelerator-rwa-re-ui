"use client";

import { useState, useEffect } from "react";
import { getAuditRecordIdsForBuilding, getAuditRecordDetails } from "@/services/auditRegistryService";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { CopeData } from "@/types/cope";

export function useCopeData(buildingId: number) {
  const [data, setData] = useState<CopeData | null>(null);
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
        const record = await getAuditRecordDetails((latestRecordId));
        const ipfsHash = record.ipfsHash;
        if (!ipfsHash) {
          setData(null);
          return;
        }

        const copeJson = await fetchJsonFromIpfs(ipfsHash);
        setData(copeJson as CopeData);
      } catch (err) {
        console.error("Failed to load COPE data:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [buildingId]);

  return { data, isLoading, isError };
}
