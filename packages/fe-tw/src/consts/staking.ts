export const MOCK_APR_DATA = [
  { date: "19 Dec", apr: 7.89 },
  { date: "20 Dec", apr: 7.85 },
  { date: "21 Dec", apr: 7.90 },
  { date: "22 Dec", apr: 7.87 },
  { date: "23 Dec", apr: 7.88 },
];

export const DEFAULT_APR = 7.89;

export const MOCK_TVL = 32111639.6;

export const MOCK_STAKING_SHARE_DATA = [
  { name: "Your Stake", value: 25 },
  { name: "Other Stakers", value: 75 },
];

export const MOCK_USER_STAKE_BALANCE = {
  stakedTokens: 200,
  stakedUSD: 3000, 
  availableTokens: 9800,
  availableUSD: 15000, 
};

export const MOCK_VTOKEN_EXCHANGE_RATE = 1.1670;

const totalUSD = MOCK_USER_STAKE_BALANCE.stakedUSD + MOCK_USER_STAKE_BALANCE.availableUSD;

export const MOCK_PERCENTAGES = {
  stakedPercentage: totalUSD ? (MOCK_USER_STAKE_BALANCE.stakedUSD / totalUSD) * 100 : 0,
  availablePercentage: totalUSD ? (MOCK_USER_STAKE_BALANCE.availableUSD / totalUSD) * 100 : 0,
};

export const MOCK_BALANCE_INFO = {
  stakedTokens: MOCK_USER_STAKE_BALANCE.stakedTokens,
  stakedUSD: MOCK_USER_STAKE_BALANCE.stakedUSD,
  stakedPercentage: MOCK_PERCENTAGES.stakedPercentage,
  availableTokens: MOCK_USER_STAKE_BALANCE.availableTokens,
  availableUSD: MOCK_USER_STAKE_BALANCE.availableUSD,
  availablePercentage: MOCK_PERCENTAGES.availablePercentage,
};


export const calculateTotalTokens = () => MOCK_TVL / MOCK_VTOKEN_EXCHANGE_RATE;

export const calculateUSDValue = (tokens: number) => tokens * MOCK_VTOKEN_EXCHANGE_RATE;
