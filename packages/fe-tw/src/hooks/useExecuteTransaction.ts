import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { TransactionReceipt } from "@hashgraph/sdk";

export const useExecuteTransaction = () => {
   const { watch } = useWatchTransactionReceipt();

   const executeTransaction = async <Transaction extends { transaction_id: string }>(
      transactionFn: () => Promise<string | TransactionReceipt | null>,
   ): Promise<Transaction> => {
      let tx: string = "";
      try {
         const result = await transactionFn();
         if (result === null) {
            throw new Error("Transaction failed: received null result");
         }
         tx = typeof result === "string" ? result : result.toString();
         return new Promise((resolve, reject) => {
            watch(tx, {
               onSuccess: (result) => {
                  resolve(result as unknown as Transaction);
                  return result;
               },
               onError: (_, error) => {
                  reject(error);
                  return _;
               },
            });
         });
      } catch (error) {
         throw { error, transaction_id: tx, tx }; // tx property left for temproral backwards compatibility
      }
   };

   return { executeTransaction };
};
