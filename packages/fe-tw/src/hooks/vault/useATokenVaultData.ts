import { useEffect, useState } from "react";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import {
	VAULT_FACTORY_ADDRESS,
	AUTO_COMPOUNDER_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { vaultFactoryAbi } from "@/services/contracts/abi/vaultFactoryAbi";
import type { QueryData } from "@/types/erc3643/types";

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
	}, [setVaultLogs, setAutoCompounderLogs]);

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
	}, [vaultLogs?.length]);

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
	}, [autoCompounderLogs?.length]);

	return {
		vaults,
		autoCompounders,
	};
};
