import {
   DEFAULT_APR,
   MOCK_APR_DATA,
   MOCK_STAKING_SHARE_DATA,
   MOCK_TVL,
   MOCK_USER_STAKE_BALANCE,
   MOCK_VTOKEN_EXCHANGE_RATE,
} from "@/consts/staking";

// TODO: replace mocks everywhere

type BuildingId = string;

export interface StakingService {
   getAPRData(buildingId: BuildingId): Promise<{ date: string; apr: number }[]>;
   getCurrentAPR(buildingId: BuildingId): Promise<number>;
   getTVL(buildingId: BuildingId): Promise<number>;
   getUserStakeBalances(buildingId: BuildingId): Promise<{
      stakedTokens: number;
      stakedUSD: number;
      availableTokens: number;
      availableUSD: number;
   }>;
   stakeTokens(buildingId: BuildingId, amount: number): Promise<void>;
   unstakeTokens(buildingId: BuildingId, amount: number): Promise<void>;
   getStakingShares(buildingId: BuildingId): Promise<{ name: string; value: number }[]>;
   getVTokenExchangeRate(buildingId: BuildingId): Promise<number>;
   getUserVotingPower(buildingId: BuildingId): Promise<number>;
   getTotalVotingPower(buildingId: BuildingId): Promise<number>;
}

export const stakingService: StakingService = {
   async getAPRData(buildingId) {
      console.log(`getAPRData called for building: ${buildingId}`);
      return MOCK_APR_DATA;
   },

   async getCurrentAPR(buildingId) {
      console.log(`getCurrentAPR called for building: ${buildingId}`);
      return DEFAULT_APR;
   },

   async getTVL(buildingId) {
      console.log(`getTVL called for building: ${buildingId}`);
      return MOCK_TVL;
   },

   async getUserStakeBalances(buildingId) {
      console.log(`getUserStakeBalances for building ${buildingId}`);
      return { ...MOCK_USER_STAKE_BALANCE };
   },

   async stakeTokens(buildingId, amount) {
      console.log(`Stake ${amount} tokens for building ${buildingId}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      console.log(`Successfully staked ${amount} tokens`);
   },

   async unstakeTokens(buildingId, amount) {
      console.log(`Unstake ${amount} tokens for building ${buildingId}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      console.log(`Successfully unstaked ${amount} tokens`);
   },

   async getStakingShares(buildingId) {
      console.log(`getStakingShares for building ${buildingId}`);
      return MOCK_STAKING_SHARE_DATA;
   },

   async getVTokenExchangeRate(buildingId) {
      console.log(`getVTokenExchangeRate for building: ${buildingId}`);
      return MOCK_VTOKEN_EXCHANGE_RATE;
   },

   async getUserVotingPower(buildingId) {
      console.log(`getUserVotingPower for building ${buildingId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return 1000; // Mocked voting power
   },

   async getTotalVotingPower(buildingId) {
      console.log(`getTotalVotingPower for building ${buildingId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return 10000;
   },
};
