export type TradeState = {
   usdcBalance: number;
   buildingTokenBalances: Record<`0x${string}`, number>; // buildingId -> token balance
};

export const tradeState: TradeState = {
   usdcBalance: 1000,
   buildingTokenBalances: {
      // just random
      "0x120": 100,
      "0x121": 100,
      "0x123": 100,
      "0x124": 100,
      "0x125": 100,
   },
};

export const oneHourTimePeriod = 60 * 60 * 60;
