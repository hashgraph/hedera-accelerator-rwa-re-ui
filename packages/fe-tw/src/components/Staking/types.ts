export interface TokenInfo {
   tokenBalance: number;
   decimals: number;
}

export interface VaultInfo {
   totalStakedTokens: number;
   userStakedTokens: number;
   rewardTokens: string[];
}

export type UserClaimedReward = {
   tokenAddress: string;
   amount: string;
   name: string;
   symbol: string;
   decimals: number;
};
