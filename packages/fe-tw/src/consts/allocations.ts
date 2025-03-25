export const mockSliceTokens = [
   {
      tokenAddress: "0xTokenA",
      idealAllocation: "33%",
      actualAllocation: "40%",
   },
   {
      tokenAddress: "0xTokenB",
      idealAllocation: "33%",
      actualAllocation: "35%",
   },
   {
      tokenAddress: "0xTokenC",
      idealAllocation: "34%",
      actualAllocation: "25%",
   },
];

export const mockTokenToBuildingMap: Record<string, { buildingId: number }> = {
   "0xTokenA": { buildingId: 1234 },
   "0xTokenB": { buildingId: 5678 },
   "0xTokenC": { buildingId: 9101 },
};
