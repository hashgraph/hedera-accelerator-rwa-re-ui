"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import useWriteContract from "@/hooks/useWriteContract";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { modularComplianceAbi } from "@/services/contracts/abi/modularComplianceAbi";
import { ContractId } from "@hashgraph/sdk";

type ComplianceHookParams = {
   buildingId: string;
   buildingAddress: `0x${string}`;
   moduleAddress: `0x${string}`;
};

export const useCompliance = ({ buildingAddress, moduleAddress }: ComplianceHookParams) => {
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const { tokenAddress } = useBuildingInfo(buildingAddress);
   const { complianceAddress } = useTokenInfo(tokenAddress);
   const { executeTransaction } = useExecuteTransaction();

   const { data: modules = [], refetch: refetchModules } = useQuery({
      queryKey: ["getModules", complianceAddress],
      queryFn: async () => {
         const result = await readContract({
            address: complianceAddress,
            abi: modularComplianceAbi,
            functionName: "getModules",
         } as any);
         return result as string[];
      },
      enabled: !!complianceAddress,
   });

   const isModuleAdded = modules.includes(moduleAddress);

   const { mutateAsync: addModule, isPending: isAddingModule } = useMutation({
      mutationFn: async () => {
         const addModuleTX = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, complianceAddress!),
               abi: modularComplianceAbi,
               functionName: "addModule",
               args: [moduleAddress],
            }),
         );
         return addModuleTX;
      },
      onSuccess: () => refetchModules(),
   });

   const { mutateAsync: removeModule, isPending: isRemovingModule } = useMutation({
      mutationFn: async () => {
         const removeModuleTX = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, complianceAddress!),
               abi: modularComplianceAbi,
               functionName: "removeModule",
               args: [moduleAddress],
            }),
         );
         return removeModuleTX;
      },
      onSuccess: () => refetchModules(),
   });

   return {
      addModule,
      removeModule,
      isModuleAdded,
      isModuleLoading: isAddingModule || isRemovingModule,
   };
};
