"use client";

import { useStakingData } from "@/hooks/useStakingData";
import React from "react";

import BalanceInfo from "@/components/Staking/BalanceInfo";
import ManageStake from "@/components/Staking/ManageStake";
import RewardsDetails from "@/components/Staking/RewardsDetails";
import StakingShareChart from "@/components/Staking/StakingShareChart";
import VotingPower from "@/components/Staking/VotingPower";
import WhyStake from "@/components/Staking/WhyStake";

interface StakingOverviewProps {
   buildingId: string;
}

export default function StakingOverview({ buildingId }: StakingOverviewProps) {
   const {
      aprData,
      currentAPR,
      tvl,
      balances,
      stakingShares,
      vTokenExchangeRate,
      votingPower,
      totalVotingPower,
      stakeTokens,
      unstakeTokens,
   } = useStakingData({ buildingId });

   return (
      <div className="p-6 bg-white rounded-lg">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <ManageStake buildingId={buildingId} onStake={stakeTokens} onUnstake={unstakeTokens} />

            <StakingShareChart data={stakingShares} />

            <BalanceInfo
               stakedTokens={balances.stakedTokens}
               stakedUSD={balances.stakedUSD}
               availableTokens={balances.availableTokens}
               availableUSD={balances.availableUSD}
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="col-span-1">
               <VotingPower votingPower={votingPower} totalVotingPower={totalVotingPower} />
            </div>
            <div className="col-span-2 flex">
               <RewardsDetails currentAPR={currentAPR} tvl={tvl} aprData={aprData} />
            </div>
         </div>

         <WhyStake />
      </div>
   );
}
