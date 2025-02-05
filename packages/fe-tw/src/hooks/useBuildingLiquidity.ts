"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ContractId } from "@hashgraph/sdk";

import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { useWalletInterface } from "@/services/useWalletInterface";

export function useBuildingLiquidity() {
  const { walletInterface } = useWalletInterface();
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function addLiquidity({
    buildingAddress,
    tokenAAddress,
    tokenBAddress,
    tokenAAmount,
    tokenBAmount,
  }: {
    buildingAddress: string;
    tokenAAddress: string;
    tokenBAddress: string;
    tokenAAmount: string;
    tokenBAmount: string; 
  }) {
    try {
      setIsAddingLiquidity(true);
      setTxHash(null);

      if (!walletInterface) {
        toast.error("No wallet connected. Please connect a wallet first.");
        return;
      }

      const parsedTokenA = BigInt(Math.floor(parseFloat(tokenAAmount) * 1e18));
      const parsedTokenB = BigInt(Math.floor(parseFloat(tokenBAmount) * 1e6));

      {
        const approveTxHash = await walletInterface.executeContractFunction(
          ContractId.fromEvmAddress(0, 0, tokenAAddress),
          tokenAbi,
          "approve",
          [buildingAddress, parsedTokenA]
        );
        if (!approveTxHash) {
          toast.error("Token A approval failed or canceled.");
          return;
        }
      }

      {
        const approveTxHash = await walletInterface.executeContractFunction(
          ContractId.fromEvmAddress(0, 0, tokenBAddress),
          tokenAbi,
          "approve",
          [buildingAddress, parsedTokenB]
        );
        if (!approveTxHash) {
          toast.error("Token B approval failed or canceled.");
          return;
        }
      }

      const liquidityTxHash = await walletInterface.executeContractFunction(
        ContractId.fromEvmAddress(0, 0, buildingAddress),
        buildingAbi,
        "addLiquidity",
        [tokenAAddress, parsedTokenA, tokenBAddress, parsedTokenB],
        undefined,
        800000
      );

      if (!liquidityTxHash) {
        toast.error("Add Liquidity transaction failed or canceled.");
        return;
      }

      setTxHash(liquidityTxHash.toString());
      toast.success("Liquidity added successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to add liquidity: ${error.message}`);
    } finally {
      setIsAddingLiquidity(false);
    }
  }

  return {
    isAddingLiquidity,
    txHash,
    addLiquidity,
  };
}
