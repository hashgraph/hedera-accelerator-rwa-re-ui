"use client";

import { MOCK_VTOKEN_EXCHANGE_RATE } from "@/consts/staking";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
      <div className="card bg-grey rounded-lg p-6 border border-gray-300 space-y-4 text-center">
         <h2 className="card-title text-black mb-4">Your Staking Share</h2>

         <div className="w-full h-64">
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
         </div>

         <p className="text-sm mt-4">Total Staked Value: ${totalStakeUSD.toLocaleString()}</p>
         <p className="text-sm mt-2">1 BUILDING TOKEN = {MOCK_VTOKEN_EXCHANGE_RATE} vTOKEN</p>
      </div>
   );
};

export default StakingShareChart;
