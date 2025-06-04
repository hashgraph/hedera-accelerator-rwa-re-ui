import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";

export const useExecuteTransaction = () => {
   const { watch } = useWatchTransactionReceipt();
   const executeTransaction = async (transactionFn) => {
      let tx;
      try {
         tx = await transactionFn();
         return new Promise((resolve, reject) => {
            watch(tx, {
               onSuccess: (result) => resolve(result),
               onError: (_, error) => reject(error),
            });
         });
      } catch (error) {
         throw { error, tx };
      }
   };

   return { executeTransaction };
};
