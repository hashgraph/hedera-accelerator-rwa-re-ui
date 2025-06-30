import { TransactionExtended } from "@/types/common";

type Props = {
   title?: string;
   txSuccess?: TransactionExtended;
   txError?: string;
};

export const TxResultToastView = ({ title, txError, txSuccess }: Props) => {
   return (
      <>
         {txSuccess && (
            <div className="flex flex-col">
               <p>{title ?? "Successful transaction!"}</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${txSuccess.transaction_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View transaction
               </a>
            </div>
         )}
         {txError && (
            <div className="flex flex-col">
               <p>{title ?? "Error occurred"}</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${(txError as any).transaction_id ?? txError}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View transaction
               </a>
            </div>
         )}
      </>
   );
};
