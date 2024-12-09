import { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotings } from "./BuildingVotings";

export const BuildingDetailPage = (props: BuildingData) => {
    return (
        <div className="flex flex-col p-10">
            <BuildingBaseInfo {...props} />
            <BuildingDetailInfo {...props.info} />
            <BuildingVotings votings={props.votingItems} />
            <BuildingSlices slices={props.partOfSlices} />
        </div>
    );
};
