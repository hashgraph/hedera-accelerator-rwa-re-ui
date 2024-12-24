"use client";

import { useEffect, useState } from "react";
import { stakingService } from "@/services/stakingService";

type ManageStakeProps = {
  buildingId: string;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
};

export default function ManageStake({ buildingId, onStake, onUnstake }: ManageStakeProps) {
  const [amount, setAmount] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0); 
  const [totalTokens, setTotalTokens] = useState(0); 

  const stakeAmount = parseFloat(amount) || 0; 
  const stakeValueUSD = stakeAmount * tokenPrice; 
  const stakePercentage = totalTokens ? (stakeAmount / totalTokens) * 100 : 0; 

  useEffect(() => {
    async function fetchTokenDetails() {
      const vTokenRate = await stakingService.getVTokenExchangeRate(buildingId);
      const tvl = await stakingService.getTVL(buildingId);
      const totalTokens = tvl / vTokenRate;

      setTokenPrice(vTokenRate);
      setTotalTokens(totalTokens); 
    }

    fetchTokenDetails();
  }, [buildingId]);

  const handleStake = async () => {
    if (stakeAmount > 0) {
      await onStake(stakeAmount);
    }
  };

  const handleUnstake = async () => {
    if (stakeAmount > 0) {
      await onUnstake(stakeAmount);
    }
  };

  return (
    <div className="card bg-neutral p-6 flex flex-col items-center">
      <h2 className="card-title text-black mb-4 text-center">Manage Your Stake</h2>

      <div className="flex items-center mb-4">
        <input
          type="number"
          className="input input-bordered w-28 text-right"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span className="ml-2 text-sm font-bold text-black">Tokens</span>
      </div>

      <div className="mb-4 text-center">
        <p className="text-sm">
          <span className="font-semibold">Proposed Stake Value:</span> ${stakeValueUSD.toFixed(2)}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Stake Percentage:</span> {stakePercentage.toFixed(2)}%
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="btn btn-primary" onClick={handleStake}>
          Stake
        </button>
        <button className="btn btn-secondary" onClick={handleUnstake}>
          Unstake
        </button>
      </div>
    </div>
  );
}
