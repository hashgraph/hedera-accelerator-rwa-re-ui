import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import useWriteContract from "./useWriteContract";

export const useBuildingAdmin = (buildingAddress: `0x${string}`) => {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();

   // todo: fix newERC3643Token tx in SC? currently got an error from SC using valid arguments.
   const createBuildingERC3643Token = (payload: CreateERC3643RequestBody): Promise<string> => {
      return new Promise((res, rej) => {
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "newERC3643Token",
            args: [buildingAddress, payload.tokenName, payload.tokenSymbol, payload.tokenDecimals],
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
   };

   return { createBuildingERC3643Token };
};
