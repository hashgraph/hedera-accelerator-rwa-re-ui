export type CopeData = {
  insuranceProvider: string;
  coverageAmount: string;
  coverageStart: string;
  coverageEnd: string;
  notes?: string;
};

// map ipfsHash -> CopeData
const copeIpfsData: Record<string, CopeData> = {
  "QmMockCopeHashFor1234": {
    insuranceProvider: "Acme Insure",
    coverageAmount: "$1,000,000",
    coverageStart: "2024-01-01",
    coverageEnd: "2025-01-01",
    notes: "Initial coverage setup."
  }
};

export { copeIpfsData };
