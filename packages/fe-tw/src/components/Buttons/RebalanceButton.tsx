"use client";

import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";
import { useCallback, useState } from "react";

interface RebalanceButtonProps {
  sliceName: string;
}

export default function RebalanceButton({ sliceName }: RebalanceButtonProps) {
  const { rebalance } = useRebalanceSlice(sliceName);
  const [isRebalancing, setIsRebalancing] = useState(false);

  const handleRebalanceClick = useCallback(async () => {
    setIsRebalancing(true);
    try {
      await rebalance();
    } catch (error) {
      console.error("Rebalance failed:", error);
    } finally {
      setTimeout(() => {
        setIsRebalancing(false);
      }, 1000);
    }
  }, [rebalance]);

  return (
    <button
      type="button"
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        isRebalancing ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleRebalanceClick}
      disabled={isRebalancing}
    >
      {isRebalancing ? "Rebalancing..." : "Rebalance"}
    </button>
  );
}
