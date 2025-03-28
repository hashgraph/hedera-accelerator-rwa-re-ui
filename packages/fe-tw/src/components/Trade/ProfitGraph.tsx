"use client";

import { useState } from "react";
import {
   CartesianGrid,
   Line,
   LineChart,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";

interface ProfitGraphProps {
   profitDataDaily: any[];
   profitDataWeekly: any[];
   profitDataMonthly: any[];
   profitDataYearly: any[];
}

export default function ProfitGraph({
   profitDataDaily,
   profitDataWeekly,
   profitDataMonthly,
   profitDataYearly,
}: ProfitGraphProps) {
   const [view, setView] = useState<"D" | "W" | "M" | "Y">("D");

   const profitData =
      view === "D"
         ? profitDataDaily
         : view === "W"
           ? profitDataWeekly
           : view === "M"
             ? profitDataMonthly
             : profitDataYearly;

   return (
      <div className="flex-1 bg-white rounded-lg p-6 border border-gray-300 relative">
         <h2 className="text-xl font-semibold mb-4">Profit Over Time</h2>

         {/* View Switch Buttons */}
         <div className="absolute top-6 right-6 flex gap-2">
            {["D", "W", "M", "Y"].map((label) => (
               <button
                  type="button"
                  key={label}
                  onClick={() => setView(label as "D" | "W" | "M" | "Y")}
                  className={`px-4 py-1 rounded-full font-semibold ${
                     view === label ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
               >
                  {label}
               </button>
            ))}
         </div>

         <ResponsiveContainer width="100%" height={200}>
            <LineChart data={profitData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="time" />
               <YAxis />
               <Tooltip />
               <Line type="monotone" dataKey="profit" stroke="#7B61FF" strokeWidth={2} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}
