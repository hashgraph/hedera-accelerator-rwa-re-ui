"use client";

import { useEvmAddress, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import {
   HashpackConnector,
   MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { tokens } from "@/consts/tokens";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "./useExecuteTransaction";
import useWriteContract from "./useWriteContract";
import { TransactionExtended } from "@/types/common";

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
   const { isConnected: isMetamaskConnected } = useWallet(MetamaskConnector);
   const { isConnected: isHashpackConnected } = useWallet(HashpackConnector);
   const { writeContract } = useWriteContract({ shouldEstimateGas: true });
   const { executeTransaction } = useExecuteTransaction();

   const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
   const [txHash, setTxHash] = useState<TransactionExtended>();
   const [txError, setTxError] = useState<string>();

   async function addLiquidity({
      buildingAddress,
      tokenAAddress,
      tokenBAddress,
      tokenAAmount,
      tokenBAmount,
   }: AddLiquidityArgs) {
      try {
         setIsAddingLiquidity(true);
         setTxHash(undefined);

         if (!isMetamaskConnected && !isHashpackConnected) {
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
         const tokenBData = tokens.find(
            (t) => t.address.toLowerCase() === tokenBAddress.toLowerCase(),
         );
         let decimalsA = tokenAData?.decimals;
         let decimalsB = tokenBData?.decimals;

         if (!decimalsA) {
            decimalsA = (await getTokenDecimals(
               tokenAAddress as `0x${string}`,
            )) as unknown as number;
         }
         if (!decimalsB) {
            decimalsB = (await getTokenDecimals(
               tokenBAddress as `0x${string}`,
            )) as unknown as number;
         }

         const parsedTokenA = BigInt(
            Math.floor(Number.parseFloat(tokenAAmount) * 10 ** decimalsA!),
         );
         const parsedTokenB = BigInt(
            Math.floor(Number.parseFloat(tokenBAmount) * 10 ** decimalsB!),
         );

         (await writeContract({
            contractId: ContractId.fromSolidityAddress(tokenAAddress as `0x${string}`),
            abi: tokenAbi,
            functionName: "approve",
            args: [buildingAddressHex, parsedTokenA],
         })) as HederaWriteContractResult;

         (await writeContract({
            contractId: ContractId.fromSolidityAddress(tokenBAddress as `0x${string}`),
            abi: tokenAbi,
            functionName: "approve",
            args: [buildingAddressHex, parsedTokenB],
         })) as HederaWriteContractResult;

         const tx = (await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromSolidityAddress(buildingAddressHex),
               abi: buildingAbi,
               functionName: "addLiquidity",
               args: [tokenAAddress, parsedTokenA, tokenBAddress, parsedTokenB],
            }),
         )) as { transaction_id: string };

         setTxHash(tx);
      } catch (error: any) {
         setTxError(error.message);
         console.error(error);
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
