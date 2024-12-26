"use client";

import { useState } from "react";
import { useTradeData } from "@/hooks/useTradeData";
import { buildings } from "@/consts/buildings";

export default function TradeForm() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(buildings[0].id);
  const [amount, setAmount] = useState("");
  const { data, sellTokens } = useTradeData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      await sellTokens({ buildingId: selectedBuildingId, amount: amt });
      alert(`Sold ${amt} tokens for USDC!`);
      setAmount("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow border-2 border-gray-300 space-y-4"
    >
      <p className="mb-4">
        Sell Token for USDC.  
        Select a building token you hold and sell it for USDC.
      </p>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="buildingSelect">
          Building
        </label>
        <select
          id="buildingSelect"
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(parseInt(e.target.value, 10))}
          className="select select-bordered w-full"
        >
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} (ID: {b.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="amount">
          Amount of tokens to sell
        </label>
        <input
          id="amount"
          type="number"
          step="1"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full"
          placeholder="e.g. 10"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
      >
        Sell Token for USDC
      </button>

      {data && (
        <div className="mt-4 text-sm text-gray-700">
            <p>Current USDC Balance: {data.usdcBalance}</p>
            <p>
            Your Holdings for Selected Building: {data.buildingBalances?.[selectedBuildingId] ?? 0} tokens
            </p>
        </div>
        )}
    </form>
  );
}
