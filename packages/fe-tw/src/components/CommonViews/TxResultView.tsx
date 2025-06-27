import { TransactionExtended } from "@/types/common";

type Props = {
   title?: string;
   txSuccess?: TransactionExtended;
   txError?: string | { transaction_id: string } | boolean;
   customSuccessView?: React.ReactElement,
};

export const TxResultToastView = ({ title, txError, txSuccess, customSuccessView = <></>}: Props) => {
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
               {customSuccessView}
            </div>
         )}
         {txError && (
            <div className="flex flex-col">
               <p>{title ?? "Error occurred"}</p>
               {typeof txError !== 'boolean' && <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${(txError as { transaction_id: string }).transaction_id ?? txError}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View transaction
               </a>}
            </div>
         )}
      </>
   );
};
