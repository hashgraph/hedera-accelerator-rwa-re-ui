"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { cx } from "class-variance-authority";

type BalanceInfoProps = {
   isLoading: boolean;
   stakedTokens: number | undefined;
   availableTokens: number | undefined;
};

export default function BalanceInfo({
   isLoading,
   stakedTokens,
   availableTokens,
}: BalanceInfoProps) {
   const chartData = [
      { name: "Staked", value: stakedTokens },
      { name: "Available", value: availableTokens },
   ];
   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Staking Share</CardTitle>
            {!isLoading && stakedTokens === 0 && availableTokens === 0 && (
               <CardDescription>No tokens staked yet</CardDescription>
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
                     <Bar dataKey="value" fill="#6b46c1" name="Amount" />
                  </BarChart>
               </ResponsiveContainer>
            )}

            {availableTokens === 0 && stakedTokens === 0 ? null : (
               <div className="text-center mt-auto">
                  <p className="text-sm">
                     <span className="font-semibold">Staked:</span> {stakedTokens} tokens
                  </p>
                  <p className="text-sm">
                     <span className="font-semibold">Available:</span> {availableTokens} tokens
                  </p>
                  <p className="text-sm mt-2">
                     <span className="font-semibold">Total Tokens:</span>&nbsp;
                     {stakedTokens + availableTokens}
                  </p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
