"use client";

import TradeFormUniswapPool from "@/components/Trade/TradeFormUniswapPool";
import TradePortfolio from "@/components/Trade/TradePortfolio";
import { useSwapsHistory } from "@/hooks/useSwapsHistory";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import type { BuildingData } from "@/types/erc3643/types";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Props = {
  building: BuildingData;
};

const tradeProfitDataMock = {
  dailyProfitInUSD: 100,
  weeklyProfitInUSD: 1000,
};

export type SwapType = 'uniswap' | 'oneSided';

// TODO's
// 1. Bring back TradeFormOneSidedExchange form
// 2. Update tx results as links
export default function TradeView({ building }: Props) {
  const [currentTab, setCurrentTab] = useState<SwapType>('uniswap');
  const { deployedBuildingTokens, tokenNames, tokenDecimals } = useBuildingDetails(
    building.address as `0x${string}`,
  );
  const buildingTokens = deployedBuildingTokens.map(
    (token) => token.tokenAddress,
  );
  const { oneSidedExchangeSwapsHistory, uniswapExchangeHistory } =
    useSwapsHistory(buildingTokens, tokenDecimals);

  return (
    <div className="mt-8 flex flex-row gap-8">
      <Tabs className="w-full" value={currentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uniswap" onClick={() => {
            setCurrentTab('uniswap');
          }}>Uniswap</TabsTrigger>
          <TabsTrigger value="oneSided" onClick={() => {
            setCurrentTab('oneSided');
          }}>One Sided Exchange</TabsTrigger>
        </TabsList>
        <TabsContent value="uniswap">
          <TradeFormUniswapPool
            buildingTokenOptions={buildingTokens.map((tok) => ({
              tokenName: tokenNames[tok],
              tokenAddress: tok,
            }))}
          />
        </TabsContent>
        <TabsContent value="oneSided">
          <p>This view is in progress</p>
          {/** <TradeFormOneSidedExchange buildingTokens={buildingTokens} /> **/}
        </TabsContent>
      </Tabs>
      <TradePortfolio
               tradeHistory={
                 currentTab === "uniswap"
                   ? uniswapExchangeHistory
                   : oneSidedExchangeSwapsHistory
               }
               tradeProfitData={tradeProfitDataMock}
      />
    </div>
  );
}
