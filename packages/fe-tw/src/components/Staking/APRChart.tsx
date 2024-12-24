"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type APRChartProps = {
  data: { date: string; apr: number }[];
};

export default function APRChart({ data }: APRChartProps) {
  return (
    <div className="card bg-white rounded-lg p-4">
      <h2 className="card-title text-black mb-2">APR</h2>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[7.8, 8]} unit="%" />
            <Tooltip />
            <Line type="monotone" dataKey="apr" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
