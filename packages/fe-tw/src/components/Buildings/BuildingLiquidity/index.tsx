'use client';

import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { addTokenToMM, getTokenDecimals, getTokenSymbol } from "@/services/erc20Service";
import { useEffect } from "react";
import { MetamaskConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";

type Props = {
   buildingAddress: `0x${string}`;
   buildingId: string;
};

export const BuildingAddLiquidity = (props: Props) => {
   const { tokenAddress } = useBuildingInfo(props.buildingId);
   const { isConnected: isMetamaskConnected } = useWallet(MetamaskConnector);

   const addBuildingTokenToWallet = async () => {
      const tokenDecimals = (await getTokenDecimals(tokenAddress as `0x${string}`))[0];
      const tokenSymbol = (await getTokenSymbol(tokenAddress as `0x${string}`))[0];
      
      if (isMetamaskConnected) {
         await addTokenToMM({
            tokenDecimals: tokenDecimals.toString(),
            tokenAddress: tokenAddress as `0x${string}`,
            tokenSymbol,
            tokenType: 'ERC20',
         });
      }
   };
   
   useEffect(() => {
      if (!!tokenAddress && isMetamaskConnected) {
         addBuildingTokenToWallet();
      }
   }, [isMetamaskConnected, tokenAddress]);
   
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg">
               <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
               <p className="text-sm sm:text-base text-gray-700">
                  This interface allows you to add liquidity.
               </p>
               <p className="mt-4 text-sm sm:text-base text-gray-700">
                  As you want to trade tokens add liquidity pair.
               </p>
            </div>

            <AddBuildingTokenLiquidityForm buildingAddress={props.buildingAddress} />
         </div>
      </div>
   );
};
