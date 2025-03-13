"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
    <div className="card bg-neutral p-6 flex flex-col items-center">
      <h2 className="card-title text-black mb-6 text-center text-base font-semibold">
        Your Balance
      </h2>

      <div className="w-full h-48 mb-6">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6b46c1" name="USD Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <p className="text-sm">
          <span className="font-semibold">Staked:</span> {stakedTokens} tokens
          (${stakedUSD.toFixed(2)})
        </p>
        <p className="text-sm">
          <span className="font-semibold">Available:</span> {availableTokens}{" "}
          tokens (${availableUSD.toFixed(2)})
        </p>
        <p className="text-sm mt-2">
          <span className="font-semibold">Total Value:</span> $
          {(stakedUSD + availableUSD).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
