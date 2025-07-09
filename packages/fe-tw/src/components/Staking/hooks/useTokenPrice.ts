import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";

type GetAmountsOutPayload = [BigInt, BigInt];

export const useTokenPrice = (
   tokenAddress: string | undefined,
   tokenDecimals: number | undefined,
) => {
   const { readContract } = useReadContract();
   const { decimals: usdcDecimals } = useTokenInfo(USDC_ADDRESS);

   return useQuery({
      queryKey: ["TOKEN_PRICE", tokenAddress],
      queryFn: async () => {
         if (!tokenAddress || !tokenDecimals || !usdcDecimals) return 0;

         const amountIn = ethers.parseUnits("1", tokenDecimals);
         const path = [tokenAddress, USDC_ADDRESS];

         const amountsOutPayload = (await readContract({
            address: UNISWAP_ROUTER_ADDRESS,
            abi: uniswapRouterAbi,
            functionName: "getAmountsOut",
            args: [amountIn, path],
         })) as GetAmountsOutPayload;

         const usdcAmountEquivalent = amountsOutPayload[1];

         return Number(usdcAmountEquivalent) / 10 ** usdcDecimals;
      },
      enabled: Boolean(tokenAddress) && Boolean(tokenDecimals) && Boolean(usdcDecimals),
   });
};
