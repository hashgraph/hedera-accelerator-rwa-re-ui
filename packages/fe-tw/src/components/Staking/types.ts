export interface TokenInfo {
   tokenBalance: number;
   decimals: number;
}

export interface VaultInfo {
   totalStakedTokens: number;
   userStakedTokens: number;
   rewardTokens: string[];
}
