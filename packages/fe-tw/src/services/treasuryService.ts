import { treasuryState, PaymentRecord, ExpenseRecord } from "@/consts/treasury";

export async function depositToTreasury(amount: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500)); 

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
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (amount > treasuryState.balance) {
    throw new Error("Insufficient treasury funds");
  }
  treasuryState.balance -= amount;
  console.log(`Payment of ${amount} USDC made to ${to}`);
}

export async function setTreasuryReserveAmount(newReserve: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
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

export function getPaymentsForBuilding(buildingId: string): PaymentRecord[] {
  return treasuryState.payments.filter((p) => p.buildingId === buildingId);
}

export function addPaymentForBuilding(
  buildingId: string,
  record: Omit<PaymentRecord, "id">
): PaymentRecord {
  const newId = treasuryState.payments.length + 1;

  const newPayment: PaymentRecord = {
    id: newId,
    ...record,
    buildingId,
  };

  treasuryState.payments.push(newPayment);
  return newPayment;
}

export function getExpensesForBuilding(buildingId: string): ExpenseRecord[] {
  return treasuryState.expenses.filter((e) => e.buildingId === buildingId);
}

export async function addExpenseForBuilding(
  buildingId: string,
  expenseData: Omit<ExpenseRecord, "id" | "buildingId" | "dateCreated">
): Promise<ExpenseRecord> {
  const newId = treasuryState.expenses.length + 1;
  const newExpense: ExpenseRecord = {
    id: newId,
    buildingId,
    dateCreated: new Date(),
    ...expenseData,
  };
  treasuryState.expenses.push(newExpense);
  return newExpense;
}
