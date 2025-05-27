"use client";

import { useStakingData } from "@/hooks/useStakingData";
import React, { useEffect } from "react";

import BalanceInfo from "@/components/Staking/BalanceInfo";
import ManageStake from "@/components/Staking/ManageStake";
import RewardsDetails from "@/components/Staking/RewardsDetails";
import StakingShareChart from "@/components/Staking/StakingShareChart";
import VotingPower from "@/components/Staking/VotingPower";
import WhyStake from "@/components/Staking/WhyStake";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStaking } from "@/components/Staking/hooks";

interface StakingOverviewProps {
   buildingId: string;
}

export const FRIENDLY_ERRORS = {
   NOT_ENOUGH_TOKENS: "You don't have enough tokens to stake. Please, buy tokens before staking.",
   NO_BUILDING_TOKEN: "This building does not have a token.",
   NO_VAULT: "This building does not have a vault.",
   NO_TREASURY: "This building does not have a treasury.",
};

export default function StakingOverview({ buildingId }: StakingOverviewProps) {
   const { aprData, currentAPR, votingPower, totalVotingPower } = useStakingData({
      buildingId,
   });

   const {
      loadingState,
      treasuryAddress,
      vaultAddress,
      tokenAddress,
      tokenBalance,
      totalStakedTokens,
      userStakedTokens,
      stakeTokens,
      unstakeTokens,
      userRewards,
      tvl,
   } = useStaking({
      buildingId,
   });

   const isLoading =
      loadingState.isFetchingTokenInfo ||
      loadingState.isFetchingTreasuryAddress ||
      loadingState.isFetchingVaultAddress;

   return (
      <div className="p-6 bg-white rounded-lg">
         {!isLoading &&
            (!tokenAddress ||
               (!tokenBalance && !userStakedTokens) ||
               !vaultAddress ||
               !treasuryAddress) && (
               <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                     <ul>
                        {!tokenAddress && <li>{FRIENDLY_ERRORS.NO_BUILDING_TOKEN}</li>}
                        {!vaultAddress && <li>{FRIENDLY_ERRORS.NO_VAULT}</li>}
                        {!treasuryAddress && <li>{FRIENDLY_ERRORS.NO_TREASURY}</li>}
                        {!tokenBalance && !userStakedTokens && (
                           <li>{FRIENDLY_ERRORS.NOT_ENOUGH_TOKENS}</li>
                        )}
                     </ul>
                  </AlertDescription>
               </Alert>
            )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <ManageStake
               isDepositing={loadingState.isDepositing}
               isWithdrawing={loadingState.isWithdrawing}
               disabled={tokenBalance === 0 && !userStakedTokens}
               buildingId={buildingId}
               onStake={stakeTokens}
               onUnstake={unstakeTokens}
            />

            <StakingShareChart
               isLoading={loadingState.isFetchingVaultInfo}
               totalStakedTokens={totalStakedTokens}
               userStakedTokens={userStakedTokens}
            />

            <BalanceInfo
               isLoading={loadingState.isFetchingVaultInfo || loadingState.isFetchingTokenInfo}
               stakedTokens={userStakedTokens}
               availableTokens={tokenBalance}
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="col-span-1">
               <VotingPower votingPower={votingPower} totalVotingPower={totalVotingPower} />
            </div>
            <div className="col-span-2 flex">
               <RewardsDetails tvl={tvl} claimableRewards={userRewards} aprData={aprData} />
            </div>
         </div>

         <WhyStake />
      </div>
   );
}
