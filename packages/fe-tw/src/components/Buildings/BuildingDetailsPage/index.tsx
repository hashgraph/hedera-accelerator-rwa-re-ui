"use client";
import type { BuildingData } from "@/types/erc3643/types";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotes } from "./BuildingVotes";

export const BuildingDetailPage = (props: BuildingData) => {
   return (
      <div>
         <BuildingBaseInfo {...props} />
         <BuildingDetailInfo {...props.info} />
         {props.voteItems?.length > 0 && <BuildingVotes votes={props.voteItems} />}
         {props.partOfSlices?.length > 0 && <BuildingSlices slices={props.partOfSlices} />}
      </div>
   );
};
