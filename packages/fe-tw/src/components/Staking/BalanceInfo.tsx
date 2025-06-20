"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { cx } from "class-variance-authority";

type BalanceInfoProps = {
   isLoading: boolean;
   stakedTokens: number | undefined;
   availableTokens: number | undefined;
   aTokenBalance: number | undefined;
   equivalentATokenBalance: number | undefined;
};

export default function BalanceInfo({
   isLoading,
   stakedTokens,
   aTokenBalance,
   availableTokens,
   equivalentATokenBalance,
}: BalanceInfoProps) {
   const chartData = [
      { name: "Staked", vTokenValue: stakedTokens, aTokenValue: equivalentATokenBalance },
      { name: "Available", vTokenValue: availableTokens },
   ];
   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Staking Share</CardTitle>
            {!isLoading && stakedTokens === 0 && availableTokens === 0 && (
               <CardDescription>No tokens staked yet</CardDescription>
            )}
            {aTokenBalance !== 0 && (
               <CardDescription className="text-xs text-muted-foreground">
                  aTokens represented as underlying building tokens (aTokens × exchange rate)
               </CardDescription>
            )}
         </CardHeader>
         <CardContent className={cx("flex flex-col flex-auto", { "h-64": availableTokens !== 0 })}>
            {isLoading ? (
               <span className="loading loading-spinner" />
            ) : availableTokens === 0 && stakedTokens === 0 ? null : (
               <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Bar dataKey="vTokenValue" stackId="a" fill="#6b46c1" name="vTokens" />
                     <Bar
                        dataKey="aTokenValue"
                        stackId="a"
                        fill="#a78bfa"
                        name="aTokens Equivalent"
                     />
                  </BarChart>
               </ResponsiveContainer>
            )}
         </CardContent>
      </Card>
   );
}
