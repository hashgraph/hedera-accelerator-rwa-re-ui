"use client";

import { useWallet, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { MetamaskConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { ContractId } from "@hashgraph/sdk";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { tokens } from "@/consts/tokens";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

type HederaWriteContractResult =
   | string
   | {
        transactionId?: { toString(): string };
     };

interface AddLiquidityArgs {
   buildingAddress: string;
   tokenAAddress: string;
   tokenBAddress: string;
   tokenAAmount: string;
   tokenBAmount: string;
}

export function useBuildingLiquidity() {
   const { isConnected } = useWallet(MetamaskConnector);
   const { writeContract } = useWriteContract();

   const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
   const [txHash, setTxHash] = useState<string | null>(null);
   const [txError, setTxError] = useState(false);

   async function addLiquidity({
      buildingAddress,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
   }: AddLiquidityArgs) {
      try {
         setIsAddingLiquidity(true);
         setTxHash(null);

         if (!isConnected) {
            toast.error("No wallet connected. Please connect first.");
            return;
         }

         if (!/^0x[0-9a-fA-F]{40}$/.test(buildingAddress)) {
            throw new Error(`Invalid EVM address: ${buildingAddress}`);
         }
         const buildingAddressHex = buildingAddress as `0x${string}`;

         const tokenAData = tokens.find(
            (t) => t.address.toLowerCase() === tokenAAddress.toLowerCase(),
         );
         const decimalsA = tokenAData ? tokenAData.decimals : 18;

         const tokenBData = tokens.find(
            (t) => t.address.toLowerCase() === tokenBAddress.toLowerCase(),
         );
         const decimalsB = tokenBData ? tokenBData.decimals : 18;

         const parsedTokenA = BigInt(Math.floor(Number.parseFloat(tokenAAmount) * 10 ** decimalsA));
         const parsedTokenB = BigInt(Math.floor(Number.parseFloat(tokenBAmount) * 10 ** decimalsB));

         // Approve Token A
         const approveA = (await writeContract({
            contractId: ContractId.fromSolidityAddress(tokenAAddress as `0x${string}`),
            abi: tokenAbi,
            functionName: "approve",
            args: [buildingAddressHex, parsedTokenA],
         })) as HederaWriteContractResult;

         // Approve Token B
         const approveB = (await writeContract({
            contractId: ContractId.fromSolidityAddress(tokenBAddress as `0x${string}`),
            abi: tokenAbi,
            functionName: "approve",
            args: [buildingAddressHex, parsedTokenB],
         })) as HederaWriteContractResult;

         const liquidityTx = (await writeContract({
            contractId: ContractId.fromSolidityAddress(buildingAddressHex),
            abi: buildingAbi,
            functionName: "addLiquidity",
            args: [tokenAAddress, parsedTokenA, tokenBAddress, parsedTokenB],
            metaArgs: {
               gas: 800000,
            },
         })) as HederaWriteContractResult;

         if (typeof liquidityTx === "string") {
            setTxHash(liquidityTx);
         } else {
            const txId = liquidityTx.transactionId?.toString() || "Unknown TxID";
            setTxHash(txId);
         }

         toast.success("Liquidity added successfully!");
      } catch (error: any) {
         setTxError(true);
         console.error(error);
         toast.error(`Failed to add liquidity: ${error.message}`);
      } finally {
         setIsAddingLiquidity(false);
      }
   }

   return {
      isAddingLiquidity,
      txHash,
      txError,
      addLiquidity,
   };
}
