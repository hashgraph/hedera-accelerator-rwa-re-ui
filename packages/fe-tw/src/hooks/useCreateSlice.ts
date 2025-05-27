import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import {
   UNISWAP_ROUTER_ADDRESS,
   USDC_ADDRESS,
   SLICE_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { CreateSliceRequestData } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useMutation } from "@tanstack/react-query";
import * as uuid from "uuid";
import { useExecuteTransaction } from "./useExecuteTransaction";
import useWriteContract from "./useWriteContract";

const CHAINLINK_PRICE_ID = "0x269501f5674BeE3E8fef90669d3faa17021344d0";

export function useCreateSlice() {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { executeTransaction } = useExecuteTransaction();

   const addSliceAllocationMutation = useMutation({
      mutationFn: async (values: any) => {
         const { sliceAllocation } = values;

         const tx = (await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, values.slice!),
               abi: sliceAbi,
               functionName: "addAllocation",
               args: [sliceAllocation.tokenAsset, CHAINLINK_PRICE_ID, sliceAllocation.allocation],
            }),
         )) as { transaction_id: string };

         return tx?.transaction_id;
      },
   });

   const waitForLastSliceDeployed = (): Promise<`0x${string}` | undefined> => {
      return new Promise((res) => {
         let logs: any = [];

         const unsubscribe = watchContractEvent({
            address: SLICE_FACTORY_ADDRESS,
            abi: sliceFactoryAbi,
            eventName: "SliceDeployed",
            onLogs: (data: any) => {
               logs = [...logs, ...data];
            },
         });

         setTimeout(() => {
            const lastSlice = [...logs].pop().args[0];

            if (lastSlice) {
               res(lastSlice);
               unsubscribe();
            } else {
               res(undefined);
            }
         }, 10000);
      });
   };

   const createSlice = async (values: CreateSliceRequestData): Promise<string> => {
      const { slice } = values;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();

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

   return {
      createSlice,
      waitForLastSliceDeployed,
      addSliceAllocationMutation,
   };
}
