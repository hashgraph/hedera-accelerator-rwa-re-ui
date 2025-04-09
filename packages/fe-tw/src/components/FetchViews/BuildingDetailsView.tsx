import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import React, { useEffect } from "react";

type Props = {
   address: `0x${string}`;
   setBuildingTokens: any;
   setBuildingTokenNames: (newNames: any) => any;
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
         setBuildingTokens((prev: any) => [...prev, ...deployedBuildingTokens]);
      }
   }, [deployedBuildingTokens, setBuildingTokens]);

   return <></>;
};
