import { stakingService } from "@/services/stakingService";
import { useEffect, useState } from "react";

interface UseStakingDataParams {
   buildingId: string;
}

export function useStakingData({ buildingId }: UseStakingDataParams) {
   const [aprData, setAprData] = useState<{ date: string; apr: number }[]>([]);
   const [currentAPR, setCurrentAPR] = useState<number>(0);
   const [tvl, setTvl] = useState<number>(0);
   const [balances, setBalances] = useState({
      stakedTokens: 0,
      stakedUSD: 0,
      availableTokens: 0,
      availableUSD: 0,
   });
   const [stakingShares, setStakingShares] = useState<{ name: string; value: number }[]>([]);
   const [vTokenExchangeRate, setVTokenExchangeRate] = useState<number>(1);
   const [votingPower, setVotingPower] = useState<number>(0);
   const [totalVotingPower, setTotalVotingPower] = useState<number>(1);

   useEffect(() => {
      async function loadAll() {
         if (!buildingId) return;

         const [
            aprRes,
            currentAPRRes,
            tvlRes,
            balancesRes,
            sharesRes,
            vRate,
            userVotingPower,
            totalPower,
         ] = await Promise.all([
            stakingService.getAPRData(buildingId),
            stakingService.getCurrentAPR(buildingId),
            stakingService.getTVL(buildingId),
            stakingService.getUserStakeBalances(buildingId),
            stakingService.getStakingShares(buildingId),
            stakingService.getVTokenExchangeRate(buildingId),
            stakingService.getUserVotingPower(buildingId),
            stakingService.getTotalVotingPower(buildingId),
         ]);

         setAprData(aprRes);
         setCurrentAPR(currentAPRRes);
         setTvl(tvlRes);
         setBalances(balancesRes);
         setStakingShares(sharesRes);
         setVTokenExchangeRate(vRate);
         setVotingPower(userVotingPower);
         setTotalVotingPower(totalPower);
      }

      void loadAll();
   }, [buildingId]);

   async function stakeTokens(amount: number) {
      if (!buildingId || !amount) return;

      await stakingService.stakeTokens(buildingId, amount);
      const newBalances = await stakingService.getUserStakeBalances(buildingId);

      setBalances(newBalances);
   }

   async function unstakeTokens(amount: number) {
      if (!buildingId || !amount) return;

      await stakingService.unstakeTokens(buildingId, amount);
      const newBalances = await stakingService.getUserStakeBalances(buildingId);

      setBalances(newBalances);
   }

   return {
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
   };
}
