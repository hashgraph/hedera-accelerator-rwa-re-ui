"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { MetamaskConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";

import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { tokens } from "@/consts/tokens";

export function useBuildingLiquidity() {
  const { isConnected, signer } = useWallet(MetamaskConnector);

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

      if (!isConnected || !signer) {
        toast.error("No wallet connected. Please connect first.");
        return;
      }

      const tokenAData = tokens.find((t) => t.address.toLowerCase() === tokenAAddress.toLowerCase());
      const decimalsA = tokenAData ? tokenAData.decimals : 18;

      const tokenBData = tokens.find((t) => t.address.toLowerCase() === tokenBAddress.toLowerCase());
      const decimalsB = tokenBData ? tokenBData.decimals : 18;
      const parsedTokenA = BigInt(
        Math.floor(parseFloat(tokenAAmount) * 10 ** decimalsA)
      );
      const parsedTokenB = BigInt(
        Math.floor(parseFloat(tokenBAmount) * 10 ** decimalsB)
      );

      const tokenAContract = new ethers.Contract(tokenAAddress, tokenAbi, signer);
      const txA = await tokenAContract.approve(buildingAddress, parsedTokenA);
      await txA.wait();
      const tokenBContract = new ethers.Contract(tokenBAddress, tokenAbi, signer);
      const txB = await tokenBContract.approve(buildingAddress, parsedTokenB);
      await txB.wait();

      const buildingContract = new ethers.Contract(buildingAddress, buildingAbi, signer);
      const txLiquify = await buildingContract.addLiquidity(
        tokenAAddress,
        parsedTokenA,
        tokenBAddress,
        parsedTokenB,
        {
          gasLimit: 800000,
        }
      );
      const receipt = await txLiquify.wait();

      setTxHash(receipt.transactionHash);
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
