export type PaymentRecord = {
   id: number;
   date: Date;
   amount: number;
   revenueType: string;
   notes?: string;
   buildingId: string;
};

export type ExpenseRecord = {
   buildingId: string;
   dateCreated: string;
   amount: string;
   receiver: string;
   notes?: string;
   title?: string;
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
         buildingId: "1234",
         title: "Office Supplies",
         amount: '100',
         receiver: "0x",
         dateCreated: new Date().toUTCString(),
         notes: "Monthly cleaning services for common areas",
      },
      {
         buildingId: "1234",
         title: "Cleaning Services",
         amount: '300',
         receiver: "0x",
         dateCreated: new Date().toUTCString(),
         notes: "Monthly cleaning services for common areas",
      },
   ],
};
