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
	imageUrl?: string;
	description: string,
	id: number;
	endsAt: number;
	name: string;
	allocation: number;
	estimatedPrice: number;
};

export type BuildingSliceCategoryData = {
	id: number;
	name: string;
	title: string;
	itemsSize?: AvatarSize;
	items?: BuildingSliceData[];
}

type BulidingYield = {
	percentage: number;
	days: number;
}

export type BuildingInfo = {
	financial: {
		percentageOwned: number,
		tokenPrice: number;
		directExposure: number;
		yield: BulidingYield[];
		treasury: number;
	},
	demographics: {
		constructedYear: number;
		type: string;
		location: string;
		locationType: string;
	};
}

export type BuildingData = {
	id: number;
	title: string;
	purchasedAt: number;
	description: string;
	info: BuildingInfo;
	votingItems: number[];
	partOfSlices: number[];
	imageUrl?: string;
};
