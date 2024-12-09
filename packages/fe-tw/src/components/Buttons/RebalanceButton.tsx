"use client";
import { useState } from "react";
import { useRebalanceSlice } from "@/hooks/useRebalanceSlice";
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
    } catch (error) {
      console.error("Rebalance failed:", error);
    } finally {
      setTimeout(() => {
        setIsRebalancing(false);
      }, 2000);
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