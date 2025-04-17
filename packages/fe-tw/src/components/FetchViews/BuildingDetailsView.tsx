import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import React, { useEffect } from "react";

type Props = {
   address: `0x${string}`;
   setBuildingTokens: (func: any) => void;
   setBuildingTokenNames: (func: any) => void;
};

export const BuildingDetailsView = ({ address, setBuildingTokens, setBuildingTokenNames }: Props) => {
   const { deployedBuildingTokens, tokenNames } = useBuildingDetails(address);

   useEffect(() => {
      if (Object.keys(tokenNames).length > 0) {
         setBuildingTokenNames((prev: any) => ({
            ...prev,
            ...tokenNames,
         }));
      }
   }, [tokenNames]);

   useEffect(() => {
      if (deployedBuildingTokens?.length) {
         setBuildingTokens((prev: any) => [
            ...prev,
            ...deployedBuildingTokens.filter(tok => !prev.find((_tok: { tokenAddress: `0x${string}` }) => _tok.tokenAddress === tok.tokenAddress))
         ]);
      }
   }, [deployedBuildingTokens, setBuildingTokens]);

   return <></>;
};
