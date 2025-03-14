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
  const [autoCompounders, setAutoCompounders] = useState<AutoCompounderItem[]>(
    [],
  );
  const [vaultLogs, setVaultLogs] = useState<any[]>([]);
  const [autoCompounderLogs, setAutoCompounderLogs] = useState<any[]>([]);

  useEffect(() => {
    watchContractEvent({
      address: AUTO_COMPOUNDER_FACTORY_ADDRESS as `0x${string}`,
      abi: autoCompounderFactoryAbi,
      eventName: "AutoCompounderDeployed",
      onLogs: (data) => {
        setAutoCompounderLogs(data);
      },
    });

    watchContractEvent({
      address: VAULT_FACTORY_ADDRESS as `0x${string}`,
      abi: vaultFactoryAbi,
      eventName: "VaultDeployed",
      onLogs: (data) => {
        setVaultLogs(data);
      },
    });
  }, []);

  useEffect(() => {
    if (vaultLogs?.length) {
      setVaults(
        vaultLogs.map((log) => ({
          address: (log as unknown as QueryData<string[]>)
            .args[0] as `0x${string}`,
          name: (log as unknown as QueryData<string[]>).args[3],
        })),
      );
    }
  }, [vaultLogs]);

  useEffect(() => {
    if (autoCompounderLogs?.length) {
      setAutoCompounders(
        autoCompounderLogs.map((log) => ({
          address: (log as unknown as QueryData<string[]>)
            .args[0] as `0x${string}`,
          name: (log as unknown as QueryData<string[]>).args[3],
        })),
      );
    }
  }, [autoCompounderLogs]);

  return {
    vaults,
    autoCompounders,
  };
};
