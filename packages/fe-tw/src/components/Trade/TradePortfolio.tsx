"use client";

import type { SwapTradeItem, SwapTradeProfit } from "@/types/erc3643/types";
import { History } from "lucide-react";

interface Props {
   tradeHistory: SwapTradeItem[];
}

const TradePortfolioItem = (props: SwapTradeItem) => {
   return (
      <div className="bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
         <div className="p-4 flex flex-col gap-3">
            <div className="w-full">
               <p className="text-sm text-gray-900 font-medium">Trade #{props.id}</p>
            </div>
            <div className="w-full">
               <p className="text-xs text-gray-500">
                  <span className="font-medium">Token sent from:</span> <span>{props.tokenA}</span>
               </p>
               <p className="text-sm text-gray-900">
                  <span className="font-medium">Amount:</span> <span>{props.tokenAAmount}</span>
               </p>
            </div>
            <div className="w-full">
               <p className="text-xs text-gray-500">
                  <span className="font-medium">Token sent to:</span> <span>{props.tokenB}</span>
               </p>
               <p className="text-sm text-gray-900">
                  <span className="font-medium">Amount:</span> <span>{props.tokenBAmount}</span>
               </p>
            </div>
         </div>
      </div>
   );
};

export default function TradePortfolio({ tradeHistory }: Props) {
   return (
      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 w-full max-w-4xl mx-auto">
         <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 p-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
               <History className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
               <h3 className="text-xl font-semibold text-indigo-900">Trade History</h3>
               <p className="text-sm text-indigo-700/70">View your completed token swaps</p>
            </div>
         </div>

         <div className="p-6">
            {tradeHistory?.length > 0 ? (
               <div
                  className="flex flex-col gap-4"
                  style={{ overflowY: "scroll", maxHeight: "50em" }}
               >
                  {tradeHistory.map((tradeItem, index) => (
                     <TradePortfolioItem key={index} {...tradeItem} />
                  ))}
               </div>
            ) : (
               <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No trades yet</h3>
                  <p className="text-gray-500">
                     Your trade history will appear here once you start swapping tokens
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
