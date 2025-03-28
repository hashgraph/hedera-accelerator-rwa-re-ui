"use client";

import {
   Bar,
   BarChart,
   CartesianGrid,
   Cell,
   Pie,
   PieChart,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_VTOKEN_EXCHANGE_RATE } from "@/consts/staking";

type BalanceInfoProps = {
   stakedTokens: number;
   stakedUSD: number;
   availableTokens: number;
   availableUSD: number;
};

export default function BalanceInfo({
   stakedTokens,
   stakedUSD,
   availableTokens,
   availableUSD,
}: BalanceInfoProps) {
   const chartData = [
      { name: "Staked", value: stakedUSD },
      { name: "Available", value: availableUSD },
   ];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Staking Share</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto h-64">
            <ResponsiveContainer>
               <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6b46c1" name="USD Value" />
               </BarChart>
            </ResponsiveContainer>

            <div className="text-center">
               <p className="text-sm">
                  <span className="font-semibold">Staked:</span> {stakedTokens} tokens ($
                  {stakedUSD.toFixed(2)})
               </p>
               <p className="text-sm">
                  <span className="font-semibold">Available:</span> {availableTokens} tokens ($
                  {availableUSD.toFixed(2)})
               </p>
               <p className="text-sm mt-2">
                  <span className="font-semibold">Total Value:</span> $
                  {(stakedUSD + availableUSD).toFixed(2)}
               </p>
            </div>
         </CardContent>
      </Card>
   );
}
