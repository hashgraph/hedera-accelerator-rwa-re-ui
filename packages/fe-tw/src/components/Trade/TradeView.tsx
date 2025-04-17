"use client";

import TradeFormUniswapPool from "@/components/Trade/TradeFormUniswapPool";
import TradePortfolio from "@/components/Trade/TradePortfolio";
import { useSwapsHistory } from "@/hooks/useSwapsHistory";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import type { BuildingData, BuildingToken } from "@/types/erc3643/types";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useBuildings } from "@/hooks/useBuildings";

type Props = {
  building?: BuildingData;
  displayOnBuildingPage?: boolean;
};

const tradeProfitDataMock = {
  dailyProfitInUSD: 100,
  weeklyProfitInUSD: 1000,
};

export type SwapType = 'uniswap' | 'oneSided';

// TODO's
// 1. Bring back TradeFormOneSidedExchange form
// 2. Update tx results as links
export default function TradeView({ building, displayOnBuildingPage = false }: Props) {
  const [currentTab, setCurrentTab] = useState<SwapType>('uniswap');
  const { deployedBuildingTokens, tokenNames, tokenDecimals } = useBuildingDetails(
    building?.address as `0x${string}`,
  );
  const buildingTokens = deployedBuildingTokens.map(
    (token) => token.tokenAddress,
  );
  const { buildingTokenNames, buildingTokens: allBuildingTokens } = useBuildings();
  const [selectedTokensPair, setSelectedTokensPair] = useState<{ tokenA?: `0x${string}`, tokenB?: `0x${string}` }>({});
  const buildingTokenOptions = !building ? allBuildingTokens.map((tok => ({
    tokenAddress: tok.tokenAddress,
    tokenName: buildingTokenNames[tok.tokenAddress],
  }))) : buildingTokens.map((tok) => ({
    tokenName: tokenNames[tok],
    tokenAddress: tok,
  }));
  const { oneSidedExchangeSwapsHistory, uniswapExchangeHistory } = useSwapsHistory(
    selectedTokensPair,
    tokenDecimals
  );

  return (
    <div className="flex flex-row gap-8">
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
            displayOnBuildingPage={displayOnBuildingPage}
            buildingTokenOptions={buildingTokenOptions}
            onTokensPairSelected={(tokenA, tokenB) => {
              setSelectedTokensPair(prev => ({
                ...prev,
                ...(!!tokenA && { tokenA }),
                ...(!!tokenB && { tokenB }),
              }))
            }}
          />
        </TabsContent>
        <TabsContent value="oneSided">
          <div className="min-w-150"></div>
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
     {/** buildings.map((building) => (
        <BuildingDetailsView
          key={building.id}
          address={building.address as `0x${string}`}
          setBuildingTokens={setAllDeployedBuildingTokens}
          setBuildingTokenNames={setAllBuildingTokenNames}
        />
      )) **/}
    </div>
  );
}
