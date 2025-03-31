import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";
import { UNISWAP_ROUTER_ADDRESS } from "@/services/contracts/addresses";
import type { SwapUniswapTokensRequestBody } from "@/types/erc3643/types";
import {
  useWriteContract,
  useReadContract,
  useWatchTransactionReceipt,
  useEvmAddress,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";

export const useUniswapTradeSwaps = () => {
  const { watch } = useWatchTransactionReceipt();
  const { writeContract } = useWriteContract();
  const { readContract } = useReadContract();
  const { data: evmAddress } = useEvmAddress();

  const getAmountsOut = (
    amount: bigint,
    tokens: `0x${string}`[],
  ): Promise<bigint[]> => {
    return readContract({
      address: UNISWAP_ROUTER_ADDRESS,
      abi: uniswapRouterAbi,
      functionName: "getAmountsOut",
      args: [amount, tokens],
    }) as Promise<bigint[]>;
  };

  const giveAllowance = async (token: string, amount: bigint) => {
    return new Promise((res, rej) => {
      writeContract({
        contractId: ContractId.fromEvmAddress(0, 0, token),
        abi: tokenAbi,
        functionName: "approve",
        args: [UNISWAP_ROUTER_ADDRESS, amount],
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

  const handleSwap = async (
    payload: SwapUniswapTokensRequestBody,
  ): Promise<string> => {
    return new Promise((res, rej) => {
      writeContract({
        contractId: ContractId.fromEvmAddress(0, 0, UNISWAP_ROUTER_ADDRESS),
        abi: uniswapRouterAbi,
        functionName: "swapExactTokensForTokens",
        args: [
          payload.amountIn,
          payload.amountOut,
          payload.path,
          evmAddress,
          payload.deadline,
        ],
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

  return { handleSwap, getAmountsOut, giveAllowance };
};
