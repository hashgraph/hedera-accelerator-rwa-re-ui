"use client";

import { useState } from "react";
import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";
import toast from "react-hot-toast";

interface RebalanceButtonProps {
  sliceName: string;
}

export default function RebalanceButton({ sliceName }: RebalanceButtonProps) {
  const { rebalance } = useRebalanceSlice(sliceName);
  const [isRebalancing, setIsRebalancing] = useState(false);

  async function handleRebalanceClick() {
    setIsRebalancing(true);
    try {
      await rebalance();
      toast.success("Rebalance completed successfully!");
    } catch (error) {
      console.error("Rebalance failed:", error);
      toast.error("Rebalance failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsRebalancing(false);
      }, 1000);
    }
  }

  return (
    <button
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
