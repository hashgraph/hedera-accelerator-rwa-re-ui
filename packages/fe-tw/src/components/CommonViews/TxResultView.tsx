import { TransactionExtended } from "@/types/common";
import { copyToClipboard } from "@/utils/helpers";
import { Check, TriangleAlert } from "lucide-react";

type Props = {
    txSuccess?: TransactionExtended,
    txError?: string,
};

export const TxResultView = ({ txError, txSuccess }: Props) => {
    return (txError || txSuccess) && (
        <div className="flex">
            {txSuccess && (
                <div className="flex gap-2 mt-5">
                    <Check size={30} className="text-green-500 font-semibold" />
                    <span className="text-sm text-green-500 font-semibold underline cursor-pointer" onClick={() => {
                        copyToClipboard(txSuccess.transaction_id);
                        window.open(`https://hashscan.io/testnet/transaction/${txSuccess.transaction_id}`, '_blank');
                    }}>
                        {`Transaction ${txSuccess.transaction_id} success with fee ${txSuccess.charged_tx_fee}`}
                    </span>
                </div>
            )}
            {txError && (
                <div className="flex gap-2 mt-5">
                    <span className="text-sm text-red-500 font-semibold mt-1">Deployment error: {txError}</span>
                    <TriangleAlert size={28} className="text-red-500 font-semibold" />
                </div>
            )}
        </div>
    );
};
