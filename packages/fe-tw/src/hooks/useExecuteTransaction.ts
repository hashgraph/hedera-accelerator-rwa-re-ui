import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";

export const useExecuteTransaction = () => {
   const { watch } = useWatchTransactionReceipt();
   const executeTransaction = async (transactionFn) => {
      try {
         const tx = await transactionFn();
         console.log(name, tx);
         return new Promise((resolve, reject) => {
            watch(tx, {
               onSuccess: (result) => resolve(result),
               onError: (_, error) => reject(error),
            });
         });
      } catch (error) {
         throw error;
      }
   };

   return { executeTransaction };
};
