"use client";

import type { AuditData } from "@/consts/audit";
import {
   getAuditRecordDetails,
   getAuditRecordIdsForBuilding,
} from "@/services/auditRegistryService";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { useMutation, useQuery } from "@tanstack/react-query";
import useWriteContract from "@/hooks/useWriteContract";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { auditRegistryAbi } from "@/services/contracts/abi/auditRegistryAbi";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useBuildingInfo } from "./useBuildingInfo";

export function useBuildingAudit(buildingAddress: `0x${string}`) {
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const [revokedRecords, setRevokedRecords] = useState<any[]>([]);
   const { data: evmAddress } = useEvmAddress();
   const { auditRegistryAddress } = useBuildingInfo(buildingAddress);

   const getNonRevokedRecord = (recordsData: bigint[]) => {
      let _recordId;

      for (let i = 0; i < recordsData.length; i++) {
         if (!revokedRecords.includes(recordsData[i])) {
            _recordId = recordsData[i];
         }
      }

      return _recordId;
   };

   useEffect(() => {
      const unsubscribe = watchContractEvent({
         address: auditRegistryAddress,
         abi: auditRegistryAbi,
         eventName: "AuditRecordRevoked",
         onLogs: (data) => {
            setRevokedRecords(
               data.map((log) => ({
                  recordId: log.args[0],
               })),
            );
         },
      });

      return () => {
         unsubscribe();
      };
   }, []);

   const { data: userRoles, isLoading: userRolesLoading } = useQuery<{
      isAdminRole: boolean;
      isAuditorRole: boolean;
   } | null>({
      queryKey: ["userRole", `userRole_${buildingAddress}`],
      queryFn: async () => {
         const adminRole = await readContract({
            address: auditRegistryAddress,
            abi: auditRegistryAbi,
            functionName: "DEFAULT_ADMIN_ROLE",
         });
         const auditorRole = await readContract({
            address: auditRegistryAddress,
            abi: auditRegistryAbi,
            functionName: "AUDITOR_ROLE",
         });
         const isAuditorRole = (await readContract({
            address: auditRegistryAddress,
            abi: auditRegistryAbi,
            functionName: "hasRole",
            args: [auditorRole, evmAddress],
         })) as boolean;
         const isAdminRole = (await readContract({
            address: auditRegistryAddress,
            abi: auditRegistryAbi,
            functionName: "hasRole",
            args: [adminRole, evmAddress],
         })) as boolean;

         return { isAdminRole, isAuditorRole };
      },
      enabled: Boolean(buildingAddress) && Boolean(evmAddress) && Boolean(auditRegistryAddress),
   });

   const { data: auditors } = useQuery<`0x${string}`[] | null>({
      queryKey: ["auditors", buildingAddress, auditRegistryAddress],
      queryFn: async () => {
         const auditorsList = await readContract({
            address: auditRegistryAddress,
            abi: auditRegistryAbi,
            functionName: "getAuditors",
         });
         return auditorsList as `0x${string}`[] | null;
      },
      enabled: Boolean(buildingAddress) && Boolean(auditRegistryAddress),
      gcTime: 10 * 60 * 1000,
   });

   const { data: auditData, isLoading: auditDataLoading } = useQuery<{
      data: AuditData;
      recordId: bigint;
   } | null>({
      queryKey: ["auditData", `auditData_${buildingAddress}`],
      queryFn: async () => {
         const recordIds = await getAuditRecordIdsForBuilding(buildingAddress);

         if (!recordIds[0]?.[0]) {
            return null;
         }

         const recordId = getNonRevokedRecord(recordIds[0]);
         const record = await getAuditRecordDetails(recordId!);
         const ipfsHash = record[0][4];

         if (!ipfsHash) {
            return null;
         }

         const auditJson = (await fetchJsonFromIpfs(ipfsHash as unknown as string)) as AuditData;

         return { data: auditJson, recordId: recordId! };
      },
      enabled: !!buildingAddress,
   });

   const addAuditRecordMutation = useMutation({
      mutationFn: async (auditIPFSHash: string) => {
         const addAuditRecordResult = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, auditRegistryAddress),
               abi: auditRegistryAbi,
               functionName: "addAuditRecord",
               args: [buildingAddress, auditIPFSHash],
            }),
         );

         return addAuditRecordResult;
      },
   });

   const updateAuditRecordMutation = useMutation({
      mutationFn: async ({
         auditRecordId,
         newAuditIPFSHash,
      }: {
         auditRecordId: bigint;
         newAuditIPFSHash: string;
      }) => {
         const updateAuditRecordResult = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, auditRegistryAddress),
               abi: auditRegistryAbi,
               functionName: "updateAuditRecord",
               args: [auditRecordId, newAuditIPFSHash],
            }),
         );

         return updateAuditRecordResult;
      },
   });

   const revokeAuditRecord = useMutation({
      mutationFn: async ({ auditRecordId }: { auditRecordId: bigint }) => {
         const revokeAuditRecordResult = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, auditRegistryAddress),
               abi: auditRegistryAbi,
               functionName: "revokeAuditRecord",
               args: [auditRecordId],
            }),
         );

         return revokeAuditRecordResult;
      },
   });

   return {
      auditors,
      auditData,
      auditDataLoading,
      addAuditRecordMutation,
      updateAuditRecordMutation,
      revokeAuditRecord,
      userRoles,
      userRolesLoading,
   };
}
