"use client";

import {
   CartesianGrid,
   Line,
   LineChart,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";

type APRChartProps = {
   data: { date: string; apr: number }[];
};

export default function APRChart({ data }: APRChartProps) {
   return (
      <ResponsiveContainer className="mt-4">
         <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[7.8, 8]} unit="%" />
            <Tooltip />
            <Line type="monotone" dataKey="apr" stroke="#8884d8" strokeWidth={2} />
         </LineChart>
      </ResponsiveContainer>
   );
}
