import type { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotes } from "./BuildingVotes";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";

export const BuildingDetailPage = (props: BuildingData) => {
	const { deployedBuildingTokens } = useBuildingDetails(
		props?.address as `0x${string}`,
	);

	console.log("deployedBuildingTokens", deployedBuildingTokens);

	return (
		<div>
			<BuildingBaseInfo {...props} />
			<BuildingDetailInfo {...props.info} />
			{props.voteItems?.length > 0 && (
				<BuildingVotes votes={props.voteItems} />
			)}
			{props.partOfSlices?.length > 0 && (
				<BuildingSlices slices={props.partOfSlices} />
			)}
		</div>
	);
};
