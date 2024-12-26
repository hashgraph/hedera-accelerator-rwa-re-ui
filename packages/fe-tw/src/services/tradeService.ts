import { tradeState } from "@/consts/trade";
import { buildings } from "@/consts/buildings";

export async function sellBuildingTokenForUSDC(buildingId: number, amount: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

  const currentBalance = tradeState.buildingTokenBalances[buildingId] || 0;
  if (amount > currentBalance) {
    throw new Error("Not enough building tokens to sell");
  }

  const building = buildings.find(b => b.id === buildingId);
  if (!building) {
    throw new Error("Building not found");
  }

  const pricePerToken = building.info.financial.tokenPrice;
  const totalUSDC = amount * pricePerToken;

  tradeState.buildingTokenBalances[buildingId] = currentBalance - amount;
  tradeState.usdcBalance += totalUSDC;
}

export async function buyBuildingTokenWithUSDC(buildingId: number, usdcAmount: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay

  if (usdcAmount > tradeState.usdcBalance) {
    throw new Error("Not enough USDC to buy");
  }

  const building = buildings.find(b => b.id === buildingId);
  if (!building) {
    throw new Error("Building not found");
  }

  const pricePerToken = building.info.financial.tokenPrice;
  const tokensToReceive = usdcAmount / pricePerToken;

  // update state: remove USDC, add tokens
  tradeState.usdcBalance -= usdcAmount;
  const currentBalance = tradeState.buildingTokenBalances[buildingId] || 0;
  tradeState.buildingTokenBalances[buildingId] = currentBalance + tokensToReceive;
}

export function getUserTradeData() {
  return {
    usdcBalance: tradeState.usdcBalance,
    buildingTokenBalances: tradeState.buildingTokenBalances,
  };
}
