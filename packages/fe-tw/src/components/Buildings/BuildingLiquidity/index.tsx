import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";

type Props = {
   buildingAddress: `0x${string}`;
};

export const BuildingAddLiquidity = (props: Props) => {
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
