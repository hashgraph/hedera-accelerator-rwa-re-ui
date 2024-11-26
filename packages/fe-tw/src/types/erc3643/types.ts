import { EvmAddress } from "@/types/common";

export type DeployTokenRequest = {
	name: string;
	symbol: string;
	decimals: number;
	complianceModules: EvmAddress[];
	complianceSettings: EvmAddress[];
};
