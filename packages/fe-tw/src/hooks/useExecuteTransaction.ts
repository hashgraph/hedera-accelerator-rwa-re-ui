import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";

export const useExecuteTransaction = () => {
   const { watch } = useWatchTransactionReceipt();

   const executeTransaction = async (transactionFn: any) => {
      let tx: string = '';

      try {
         tx = await transactionFn();
         return new Promise((resolve, reject) => {
            watch(tx, {
               onSuccess: (result) => (resolve as any)(result),
               onError: (_, error) => (reject as any)(error),
            });
         });
      } catch (error) {
         throw { error, tx };
      }
   };

   return { executeTransaction };
};
