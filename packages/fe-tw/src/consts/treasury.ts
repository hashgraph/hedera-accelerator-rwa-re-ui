export type TreasuryState = {
    balance: number;
    reserveAmount: number;
    nPercentage: number; // in basis points (10000 = 100%)
    businessBalance: number;
  };
  
  export const treasuryState: TreasuryState = {
    balance: 10000,    
    reserveAmount: 2000,
    nPercentage: 3000, 
    businessBalance: 0,
  };
  