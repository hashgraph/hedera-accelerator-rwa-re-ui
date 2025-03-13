import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import {
  UNISWAP_ROUTER_ADDRESS,
  USDC_ADDRESS,
} from "@/services/contracts/addresses";
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { CreateSliceRequestBody } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import {
  useWatchTransactionReceipt,
  useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import * as uuid from "uuid";

export function useCreateSlice() {
  const { writeContract } = useWriteContract();
  const { watch } = useWatchTransactionReceipt();

  const handleCreateSlice = async (
    formData: CreateSliceRequestBody,
  ): Promise<string> => {
    const keyRequest = await fetch("/api/pinataKey");
    const keyData = await keyRequest.json();

    return new Promise((res, rej) => {
      pinata.upload
        .json(formData, {
          metadata: { name: `Slice-${formData.name}` },
        })
        .key(keyData.JWT)
        .then(({ IpfsHash }) => {
          const sliceDetails = {
            uniswapRouter: UNISWAP_ROUTER_ADDRESS,
            usdc: USDC_ADDRESS,
            name: formData.name,
            symbol: formData.symbol,
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
    handleCreateSlice,
  };
}
