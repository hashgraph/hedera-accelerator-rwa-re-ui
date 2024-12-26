import { treasuryState } from "@/consts/treasury";

export async function depositToTreasury(amount: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate async

  const toBusiness = Math.floor((amount * treasuryState.nPercentage) / 10000);
  const toTreasury = amount - toBusiness;

  treasuryState.businessBalance += toBusiness;
  treasuryState.balance += toTreasury;

  if (treasuryState.balance > treasuryState.reserveAmount) {
    const excess = treasuryState.balance - treasuryState.reserveAmount;
    treasuryState.balance -= excess;
    console.log(`Excess ${excess} USDC forwarded to vault (mock)`);
    // TODO: replace mock. call vault.deposit(excess) here
  }
}

export async function makeTreasuryPayment(to: string, amount: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (amount > treasuryState.balance) {
    throw new Error("Insufficient treasury funds");
  }
  treasuryState.balance -= amount;
  console.log(`Payment of ${amount} USDC made to ${to}`);
}

export async function setTreasuryReserveAmount(newReserve: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  treasuryState.reserveAmount = newReserve;

  if (treasuryState.balance > treasuryState.reserveAmount) {
    const excess = treasuryState.balance - treasuryState.reserveAmount;
    treasuryState.balance -= excess;
    console.log(`Excess ${excess} USDC forwarded to vault after reserve update (mock)`);
  }
}

export function getTreasuryBalance(): number {
  return treasuryState.balance;
}

export function getTreasuryReserve(): number {
  return treasuryState.reserveAmount;
}

export function getBusinessBalance(): number {
  return treasuryState.businessBalance;
}
