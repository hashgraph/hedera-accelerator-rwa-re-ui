import type { AvatarSize } from "@/components/Avatars/ReusableAvatar";
import type { EvmAddress } from "@/types/common";

export type DeployTokenRequest = {
	name: string;
	symbol: string;
	decimals: number;
	complianceModules: EvmAddress[];
	complianceSettings: EvmAddress[];
};

export type BuildingSliceData = {
	imageSource: string;
	name: string;
	allocation: number;
	timeToEnd: number;
	estimatedPrice: number;
	description: string;
}

export type BuildingSliceCategoryData = {
	name: string;
	title: string;
	itemsSize?: AvatarSize;
	items?: BuildingSliceData[];
};
