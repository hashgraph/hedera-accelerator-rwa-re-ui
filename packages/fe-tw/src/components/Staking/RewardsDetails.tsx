"use client";

import { UserClaimedReward } from "./types";
import InfoCard from "./InfoCard";
import ClaimedRewardsCard from "./ClaimedRewardsCard";

interface IProps {
   claimableRewards: string;
   aprData: { date: string; apr: number }[];
   tvl: string;
   userClaimedRewards: UserClaimedReward[];
}

const InfoCardRender = InfoCard as any

export default function RewardsDetails({
   tvl,
   claimableRewards,
   aprData,
   userClaimedRewards,
}: IProps) {
   return (
      <div className="flex gap-6 w-full">
         <InfoCardRender claimableRewards={claimableRewards} tvl={tvl} />
         <ClaimedRewardsCard userClaimedRewards={userClaimedRewards} />
      </div>
   );
}
