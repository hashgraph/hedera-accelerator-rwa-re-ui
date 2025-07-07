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
import { AUDIT_REGISTRY_ADDRESS } from "@/services/contracts/addresses";
import { useEffect, useState } from "react";
import { useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";

export function useBuildingAudit(buildingAddress: `0x${string}`) {
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const [revokedRecords, setRevokedRecords] = useState<any[]>([]);
   const { data: evmAddress } = useEvmAddress();

   const getNonRevokedRecord = (recordsData: any[]) => {
      let _recordId

      for (let i = 0; i < recordsData.length; i++) {
         if (!revokedRecords.includes(recordsData[i])) {
            _recordId = recordsData[i];
         }
      }

      return _recordId;
   };

   useEffect(() => {
      const unsubscribe = watchContractEvent({
         address: AUDIT_REGISTRY_ADDRESS,
         abi: auditRegistryAbi,
         eventName: "AuditRecordRevoked",
         onLogs: (data: any[]) => {
            setRevokedRecords(data.map((log) => ({
               recordId: log.args[0],
            })));
         },
      });

      return () => {
         unsubscribe();
      };
   }, []);

   const { data: userRoles, isLoading: userRolesLoading } = useQuery<{
      isAdminRole: boolean,
      isAuditorRole: boolean,
   } | null>({
      queryKey: ["userRole", `userRole_${buildingAddress}`],
      queryFn: async () => {
         const adminRole = await readContract({
            address: AUDIT_REGISTRY_ADDRESS,
            abi: auditRegistryAbi,
            functionName: "DEFAULT_ADMIN_ROLE",
         });
         const auditorRole = await readContract({
            address: AUDIT_REGISTRY_ADDRESS,
            abi: auditRegistryAbi,
            functionName: "AUDITOR_ROLE",
         });
         const isAuditorRole = await readContract({
            address: AUDIT_REGISTRY_ADDRESS,
            abi: auditRegistryAbi,
            functionName: "hasRole",
            args: [auditorRole, evmAddress],
         }) as boolean;
         const isAdminRole = await readContract({
            address: AUDIT_REGISTRY_ADDRESS,
            abi: auditRegistryAbi,
            functionName: "hasRole",
            args: [adminRole, evmAddress],
         }) as boolean;

         return { isAdminRole, isAuditorRole };
      },
      enabled: !!buildingAddress && !!evmAddress,
   });

   const { data: auditData, isLoading: auditDataLoading } = useQuery<{ data: AuditData, recordId: bigint } | null>({
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

         const auditJson = await fetchJsonFromIpfs(ipfsHash as unknown as string) as AuditData;

         return { data: auditJson, recordId: recordId! };
      },
      enabled: !!buildingAddress,
   });

   const addAuditRecordMutation = useMutation({
      mutationFn: async (auditIPFSHash: string) => {
         const addAuditRecordResult = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
            abi: auditRegistryAbi,
            functionName: "addAuditRecord",
            args: [buildingAddress, auditIPFSHash],
         })) as { transaction_id: string };

         return addAuditRecordResult;
      },
   });

   const addAuditorRole = useMutation({
      mutationFn: async (wallet: `0x${string}`) => {
         const auditorRole = await readContract({
            address: AUDIT_REGISTRY_ADDRESS,
            abi: auditRegistryAbi,
            functionName: "AUDITOR_ROLE",
         }) as any;

         const addAuditorResult = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
            abi: auditRegistryAbi,
            functionName: "grantRole",
            args: [auditorRole, wallet],
         })) as { transaction_id: string };

         return addAuditorResult;
      },
   });

   const updateAuditRecordMutation = useMutation({
      mutationFn: async ({
         auditRecordId,
         newAuditIPFSHash,
      }: {
         auditRecordId: bigint,
         newAuditIPFSHash: string,
      }) => {
         const updateAuditRecordResult = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
            abi: auditRegistryAbi,
            functionName: "updateAuditRecord",
            args: [auditRecordId, newAuditIPFSHash],
         })) as { transaction_id: string };

         return updateAuditRecordResult;
      },
   });

   const revokeAuditRecord = useMutation({
      mutationFn: async ({
         auditRecordId
      }: {
         auditRecordId: bigint,
      }) => {
         const revokeAuditRecordResult = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
            abi: auditRegistryAbi,
            functionName: "revokeAuditRecord",
            args: [auditRecordId],
         })) as { transaction_id: string };

         return revokeAuditRecordResult;
      },
   });

   return {
      auditData,
      auditDataLoading,
      addAuditRecordMutation,
      updateAuditRecordMutation,
      revokeAuditRecord,
      addAuditorRole,
      userRoles,
      userRolesLoading,
   };
}
