"use client";

import { MOCK_VTOKEN_EXCHANGE_RATE } from "@/consts/staking";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StakingShareChartProps = {
   data?: { name: string; value: number }[];
   totalStakeUSD?: number;
};

const StakingShareChart = ({ data = [], totalStakeUSD = 0 }: StakingShareChartProps) => {
   const chartData =
      data.length > 0
         ? data
         : [
              { name: "Your Stake", value: 25 },
              { name: "Other Stakers", value: 75 },
           ];

   const COLORS = ["#6b46c1", "#E5E5E5"];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Staking Share</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto h-64">
            <ResponsiveContainer>
               <PieChart>
                  <Pie
                     data={chartData}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     isAnimationActive={true}
                     animationDuration={800}
                     animationBegin={0}
                  >
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip />
               </PieChart>
            </ResponsiveContainer>

            <div className="text-center">
               <p className="text-sm">
                  <span className="font-semibold">Total Staked Value:</span>$
                  {totalStakeUSD.toLocaleString()}
               </p>
               <p className="text-sm">
                  <span className="font-semibold">1 BUILDING TOKEN = </span>{" "}
                  {MOCK_VTOKEN_EXCHANGE_RATE} vTOKEN
               </p>
            </div>
         </CardContent>
      </Card>
   );
};

export default StakingShareChart;
