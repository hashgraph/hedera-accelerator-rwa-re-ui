import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { vaultFactoryAbi } from "@/services/contracts/abi/vaultFactoryAbi";
import {
   AUTO_COMPOUNDER_FACTORY_ADDRESS,
   VAULT_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { QueryData } from "@/types/erc3643/types";
import { useEffect, useState } from "react";

type VaultItem = {
   address: `0x${string}`;
   name: string;
};

type AutoCompounderItem = {
   address: `0x${string}`;
   name: string;
};

export const useATokenVaultData = () => {
   const [vaults, setVaults] = useState<VaultItem[]>([]);
   const [autoCompounders, setAutoCompounders] = useState<AutoCompounderItem[]>([]);
   const [vaultLogs, setVaultLogs] = useState<any[]>([]);
   const [autoCompounderLogs, setAutoCompounderLogs] = useState<any[]>([]);

   useEffect(() => {
      watchContractEvent({
         address: AUTO_COMPOUNDER_FACTORY_ADDRESS as `0x${string}`,
         abi: autoCompounderFactoryAbi,
         eventName: "AutoCompounderDeployed",
         onLogs: (data) => {
            setAutoCompounderLogs(prev => [
               ...prev,
               ...data.filter(comp => !prev.find(comp1 => comp1.args[0] === (comp as unknown as { args: string[] }).args[0])),
            ]);
         },
      });

      watchContractEvent({
         address: VAULT_FACTORY_ADDRESS as `0x${string}`,
         abi: vaultFactoryAbi,
         eventName: "VaultDeployed",
         onLogs: (data) => {
            setVaultLogs(prev => [
               ...prev,
               ...data.filter(vault => !prev.find(vault1 => vault1.args[0] === (vault as unknown as { args: string[] }).args[0])),
            ]);
         },
      });
   }, []);

   useEffect(() => {
      if (vaultLogs?.length) {
         setVaults(
            vaultLogs.map((log) => ({
               address: (log as unknown as QueryData<string[]>).args[0] as `0x${string}`,
               name: (log as unknown as QueryData<string[]>).args[3],
            })),
         );
      }
   }, [vaultLogs]);

   useEffect(() => {
      if (autoCompounderLogs?.length) {
         setAutoCompounders(
            autoCompounderLogs.map((log) => ({
               address: (log as unknown as QueryData<string[]>).args[0] as `0x${string}`,
               name: (log as unknown as QueryData<string[]>).args[3],
               vaultAddress: (log as unknown as QueryData<string[]>).args[1] as `0x${string}`,
            })),
         );
      }
   }, [autoCompounderLogs]);

   return {
      vaults,
      autoCompounders,
   };
};
