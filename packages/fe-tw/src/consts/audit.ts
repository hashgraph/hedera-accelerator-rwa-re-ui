export type AuditData = {
   insuranceProvider?: string;
   coverageAmount?: string;
   coverageStart?: string;
   coverageEnd?: string;
   notes?: string;
};

export const copeIpfsData: Record<string, AuditData> = {
   QmMockCopeHashFor1234: {
      insuranceProvider: "Acme Insure",
      coverageAmount: "$1,000,000",
      coverageStart: "2024-01-01",
      coverageEnd: "2025-01-01",
      notes: "Initial coverage setup. Assess expansions for floors 8-10.",
   },
};
