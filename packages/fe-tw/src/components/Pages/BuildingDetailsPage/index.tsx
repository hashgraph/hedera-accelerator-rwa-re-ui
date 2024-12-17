import { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotings } from "./BuildingVotings";

export const BuildingDetailPage = (props: BuildingData) => {
  return (
    <div className="flex flex-col space-y-8 px-6 sm:px-8 md:px-12 lg:px-16 py-6 mx-auto max-w-screen-xl">
        <BuildingBaseInfo {...props} />
        <BuildingDetailInfo {...props.info} />
        <BuildingVotings votings={props.votingItems} />
        <BuildingSlices slices={props.partOfSlices} />
    </div>
  );
};
