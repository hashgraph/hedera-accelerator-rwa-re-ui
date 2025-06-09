export type EvmAddress = `0x${string}`;
export type VoteType = "yes" | "no";
export type ExpenseType = "once-off" | "recurring";
export type ExpenseMethod = "flat" | "percentage";
export type TransactionExtended = {
   transaction_id: string;
   consensus_timestamp?: string;
   result?: string;
   charged_tx_fee?: number,
};
