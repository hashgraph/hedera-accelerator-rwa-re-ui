import { tradeState } from "@/consts/trade";
// todo: all services that exported `@/consts/buildings` should be cleared up (assigned to @Nadine).
import { buildings } from "@/consts/buildings";

export async function sellBuildingTokenForUSDC(buildingId: `0x${string}`, amount: number): Promise<void> {
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

export async function buyBuildingTokenWithUSDC(buildingId: `0x${string}`, usdcAmount: number): Promise<void> {
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
