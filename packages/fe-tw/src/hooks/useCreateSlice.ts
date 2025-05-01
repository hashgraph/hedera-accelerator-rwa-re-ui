import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS, SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { CreateSliceRequestData } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import { useWatchTransactionReceipt, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as uuid from "uuid";
import { useExecuteTransaction } from "./useExecuteTransaction";

const CHAINLINK_PRICE_ID = "0x269501f5674BeE3E8fef90669d3faa17021344d0";

export function useCreateSlice(deployedSlice?: `0x${string}`) {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { executeTransaction } = useExecuteTransaction();
   const [sliceData, setSliceData] = useState<CreateSliceRequestData>();
   const [isSliceDeployed, setSliceDeployed] = useState(false);
   const [addSliceAllocationTxId, setAddSliceAllocationTxId] = useState<string>();

   const addSliceAllocationMutation = useMutation({
      mutationFn: async (values: CreateSliceRequestData) => {
         const { sliceAllocation } = values;

         const tx = await executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, deployedSlice!),
            abi: sliceAbi,
            functionName: "addAllocation",
            args: [sliceAllocation.tokenAsset, CHAINLINK_PRICE_ID, sliceAllocation.allocation],
         })) as { transaction_id: string };
   
         return tx?.transaction_id;
      },
      onSuccess: (txId) => {
         setAddSliceAllocationTxId(txId);
      }
   });

   const createSlice = async (values: CreateSliceRequestData): Promise<string> => {
      const { slice } = values;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();
      setSliceData(values);

      return new Promise((res, rej) => {
         pinata.upload
            .json(slice, {
               metadata: { name: `Slice-${slice.name}` },
            })
            .key(keyData.JWT)
            .then(({ IpfsHash }) => {
               const sliceDetails = {
                  uniswapRouter: UNISWAP_ROUTER_ADDRESS,
                  usdc: USDC_ADDRESS,
                  name: slice.name,
                  symbol: slice.symbol,
                  metadataUri: IpfsHash,
               };

               writeContract({
                  contractId: ContractId.fromEvmAddress(0, 0, SLICE_FACTORY_ADDRESS),
                  abi: sliceFactoryAbi,
                  functionName: "deploySlice",
                  args: [uuid.v4(), sliceDetails],
               })
                  .then((tx) => {
                     watch(tx as string, {
                        onSuccess: (transaction) => {
                           res(transaction.transaction_id);
                           setSliceDeployed(true);

                           return transaction;
                        },
                        onError: (transaction, err) => {
                           rej(err);

                           return transaction;
                        },
                     });
                  })
                  .catch((err) => {
                     rej(err);
                  });
            });
      });
   };

   useEffect(() => {
      if (deployedSlice && isSliceDeployed && !!sliceData) {
         addSliceAllocationMutation.mutate(sliceData);
      }
   }, [deployedSlice, isSliceDeployed]);

   
   return {
      createSlice,
      addSliceAllocationMutation,
      addSliceAllocationTxId,
   };
}
