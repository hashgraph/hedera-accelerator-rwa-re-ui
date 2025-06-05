"use client";

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
            tokenType: "ERC20",
         });
      }
   };

   useEffect(() => {
      if (!!tokenAddress && isMetamaskConnected) {
         addBuildingTokenToWallet();
      }
   }, [isMetamaskConnected, tokenAddress]);

   return (
      <div className=" max-w-7xl space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddBuildingTokenLiquidityForm buildingAddress={props.buildingAddress} />
         </div>
      </div>
   );
};
