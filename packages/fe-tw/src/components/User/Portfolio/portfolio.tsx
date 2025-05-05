"use client";
import { useState } from "react";
import { usePortfolioData, usePortfolioHistoryQuery } from "./hooks";
import { TimespanTabs } from "./TimespanTabs";
import { SectionCards } from "./SectionCards";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioTable } from "./PortfolioTable";
import { TimeFrame } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default () => {
   const [activeTab, setActiveTab] = useState<TimeFrame>("1M");
   const { data: portfolioTokens, isLoading: isLoadingTokens } = usePortfolioData();
   const {
      data: portfolioHistory,
      isLoading: isLoadingHistory,
      error: historyError,
   } = usePortfolioHistoryQuery(portfolioTokens, activeTab);

   return (
      <div className="flex flex-col gap-4">
         <TimespanTabs value={activeTab} onChange={setActiveTab} />
         <SectionCards data={portfolioTokens} />
         {isLoadingHistory || isLoadingTokens ? (
            <Card>
               <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
               </CardHeader>
               <CardContent>
                  <p>Loading chart data...</p>
               </CardContent>
            </Card>
         ) : historyError ? (
            <Card>
               <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
               </CardHeader>
               <CardContent>
                  <p>Error loading chart data.</p>
               </CardContent>
            </Card>
         ) : (
            <PortfolioChart historyData={portfolioHistory} tokens={portfolioTokens} />
         )}
         <PortfolioTable data={portfolioTokens} />
      </div>
   );
};
