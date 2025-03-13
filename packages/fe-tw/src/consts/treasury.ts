export type PaymentRecord = {
  id: number;
  date: Date;
  amount: number;
  revenueType: string;
  notes?: string;
  buildingId: string;
};

export type ExpenseRecord = {
  id: number;
  buildingId: string;
  title: string;
  amount: number;
  expenseType: "once-off" | "recurring";
  method: "flat" | "percentage";
  period?: number;
  endDate?: Date;
  percentage?: number;
  notes?: string;
  dateCreated: Date;
};

export type TreasuryState = {
  balance: number;
  reserveAmount: number;
  nPercentage: number;
  businessBalance: number;
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
};

export const treasuryState: TreasuryState = {
  balance: 10000,
  reserveAmount: 2000,
  nPercentage: 3000,
  businessBalance: 0,

  payments: [
    {
      id: 1,
      date: new Date(2024, 12, 1),
      amount: 1500,
      revenueType: "rental",
      notes: "Monthly rent payment",
      buildingId: "1234",
    },
    {
      id: 2,
      date: new Date(2024, 12, 5),
      amount: 250,
      revenueType: "parking",
      notes: "Parking fees",
      buildingId: "1234",
    },
  ],

  expenses: [
    {
      id: 1,
      buildingId: "1234",
      title: "Office Supplies",
      amount: 100,
      expenseType: "once-off",
      method: "flat",
      dateCreated: new Date(),
    },
    {
      id: 2,
      buildingId: "1234",
      title: "Cleaning Services",
      amount: 300,
      expenseType: "recurring",
      method: "flat",
      period: 30,
      endDate: new Date(2025, 12, 1),
      dateCreated: new Date(2024, 12, 1),
      notes: "Monthly cleaning services for common areas",
    },
  ],
};

export type ExpenseType = ExpenseRecord["expenseType"];

export type ExpenseMethod = ExpenseRecord["method"];
