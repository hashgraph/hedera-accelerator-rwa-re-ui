"use client";

import type { SwapTradeItem, SwapTradeProfit } from "@/types/erc3643/types";

interface Props {
   tradeHistory: SwapTradeItem[];
   tradeProfitData: SwapTradeProfit;
}

const TradePortfolioItem = (props: SwapTradeItem) => {
   return (
      <div className="bg-gray-100 rounded-lg p-6 w-full">
         <div className="flex bg-white p-5 flex-col justify-between items-center">
            <div className="w-full">
               <p className="text-md text-gray-600 font-bold">Item #{props.id}</p>
            </div>
            <div className="w-full">
               <p className="text-sm text-gray-500">
                  <b>Token A address:</b> <span>{props.tokenA}</span>
               </p>
               <p className="text-sm text-green-500">
                  <b>Token A amount:</b> <span>{props.tokenAAmount}</span>
               </p>
            </div>
            <div className="w-full">
               <p className="text-sm text-gray-500">
                  <b>Token B address:</b> <span>{props.tokenB}</span>
               </p>
               <p className="text-sm text-green-500">
                  <b>Token B amount:</b> <span>{props.tokenBAmount}</span>
               </p>
            </div>
         </div>
      </div>
   );
};

export default function TradePortfolio({ tradeHistory, tradeProfitData }: Props) {
   return (
      <>
         <div className="bg-white rounded-lg p-10 border border-gray-300 w-6/12">
            <h1 className="text-2xl font-bold mb-4">Trade Portfolio</h1>
            <div className="bg-gray-100 rounded-lg p-6 shadow-xs">
               <div className="flex flex-col justify-between items-center">
                  <div className="w-full">
                     <p className="text-md text-gray-500 font-bold">Daily profit</p>
                     <p className="text-green-500">+${tradeProfitData.dailyProfitInUSD}</p>
                  </div>
                  <div className="w-full">
                     <p className="text-md text-gray-500 font-bold">Weekly profit</p>
                     <p className="text-green-500">+${tradeProfitData.weeklyProfitInUSD}</p>
                  </div>
               </div>
            </div>
            {tradeHistory?.length && (
               <>
                  <h1 className="text-2xl font-bold mb-4 mt-6">Trade History</h1>
                  <div
                     className="flex flex-col gap-2"
                     style={{ overflowY: "scroll", maxHeight: "50em" }}
                  >
                     {tradeHistory.map((tradeItem, id) => (
                        <TradePortfolioItem key={tradeItem.id} {...tradeItem} />
                     ))}
                  </div>
               </>
            )}
         </div>
      </>
   );
}
