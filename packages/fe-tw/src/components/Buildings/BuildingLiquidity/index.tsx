"use client";

import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";

type Props = {
   buildingAddress: `0x${string}`;
   buildingId: string;
};

export const BuildingAddLiquidity = (props: Props) => {
   return (
      <div className=" max-w-7xl space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddBuildingTokenLiquidityForm buildingAddress={props.buildingAddress} />
         </div>
      </div>
   );
};
