export const getFutureDate = (days: number): Date => {
  return new Date(Date.now() + days * 24 * 3600 * 1000);
};

export const getCurrentDate = (): Date => {
  return new Date();
};
