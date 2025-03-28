"use client";

import TradeFormOneSidedExchange from "@/components/Trade/TradeFormOneSidedExchange";
import TradeFormUniswapPool from "@/components/Trade/TradeFormUniswapPool";
import TradePortfolio from "@/components/Trade/TradePortfolio";
import { useSwapsHistory } from "@/hooks/useSwapsHistory";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { BuildingData } from "@/types/erc3643/types";
import { useState } from "react";
import { SwapType, TradeFormTypeTabs } from "./TradeFormTypeTabs";

type Props = {
   building: BuildingData;
};

// todo: replace with real data and logic
const isUniswapPage = false;
const buildingTokensMock: `0x${string}`[] = [
   "0xD42E127BDA83cC0761f87A4c0E4CF834Fd2E6085",
   "0xF36e7F2cCEb7FF5B95796786817523082C700f18",
];
const tradeProfitDataMock = {
   dailyProfitInUSD: 100,
   weeklyProfitInUSD: 1000,
};

export default function TradeView({ building }: Props) {
   const { oneSidedExchangeSwapsHistory } = useSwapsHistory();

   return (
      <>
         <div className="mt-8 flex flex-wrap flex-row gap-8 w-full">
            {isUniswapPage ? (
               <TradeFormUniswapPool buildingAddress={building.address as `0x${string}`} />
            ) : (
               <TradeFormOneSidedExchange buildingTokens={buildingTokensMock} />
            )}
            <TradePortfolio
               tradeHistory={oneSidedExchangeSwapsHistory}
               tradeProfitData={tradeProfitDataMock}
            />
         </div>
      </>
   );
}
