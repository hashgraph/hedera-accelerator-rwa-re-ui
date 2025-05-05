export type TimeFrame = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

export interface HistoryPoint {
   date: string;
   value: number;
}

export type PortfolioHistoryData = Record<string, HistoryPoint[] | null>;

export interface PortfolioToken {
   tokenAddress: string;
   balance: number;
   symbol: string;
   exchangeRateUSDC: number;
   pendingRewards: number;
}
