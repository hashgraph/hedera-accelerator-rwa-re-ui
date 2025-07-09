import { tryCatch } from "@/services/tryCatch";
import { estimateGas } from "@/services/wallets/estimateGas";
import { useEvmAddress, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HashpackConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useWriteContract as useOriginalWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { ethers } from "ethers";

export interface WriteContractParams {
   contractId: ContractId;
   abi: readonly unknown[] | any;
   functionName: string;
   args: any[];
   metaArgs?: {
      gas?: number;
      [key: string]: any;
   };
}

interface EstimatedGasResult {
   result: string | number;
}

const useWriteContract = ({ shouldEstimateGas }: { shouldEstimateGas?: boolean } = {}) => {
   const { writeContract } = useOriginalWriteContract();
   const { data: evmAddress } = useEvmAddress();
   const { isConnected: isHashpackConnected } = useWallet(HashpackConnector);

   const handleWriteContract = async (params: WriteContractParams) => {
      if ((isHashpackConnected && evmAddress) || shouldEstimateGas) {
         const { data: estimatedGasResult, error: estimationError } = await tryCatch(
            estimateGas(
               evmAddress,
               params.contractId,
               params.abi,
               params.functionName,
               params.args,
            ),
         );

         if (estimationError) {
            console.warn("Error estimating gas, proceeding with original params:", estimationError);
            return writeContract(params);
         }

         const formattedGas = (estimatedGasResult as EstimatedGasResult)?.result
            ? Number((estimatedGasResult as EstimatedGasResult).result)
            : undefined;

         if (formattedGas && !isNaN(formattedGas)) {
            return writeContract({
               ...params,
               metaArgs: { ...params.metaArgs, gas: formattedGas },
            });
         } else {
            console.warn(
               "Gas estimation did not return a valid number. Proceeding with original params.",
            );
            return writeContract(params);
         }
      }

      return writeContract(params);
   };

   return { writeContract: handleWriteContract };
};

export default useWriteContract;
