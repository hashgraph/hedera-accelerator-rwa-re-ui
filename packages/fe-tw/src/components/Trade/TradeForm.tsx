"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTradeData } from "@/hooks/useTradeData";
import { buildings } from "@/consts/buildings";

export default function TradeForm() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(buildings[0].id);
  const [amount, setAmount] = useState("");
  const { sellTokens } = useTradeData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Invalid amount. Please enter a positive number.");
      return;
    }

    try {
      await sellTokens({ buildingId: selectedBuildingId, amount: amt });
      toast.success(`Successfully sold ${amt} tokens for USDC!`);
      setAmount("");
    } catch (err: any) {
      toast.error(`Failed to sell tokens: ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 bg-white rounded-lg p-6 border border-gray-300 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Sell Tokens</h2>
      <p className="text-gray-700">
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
    </form>
  );
}
