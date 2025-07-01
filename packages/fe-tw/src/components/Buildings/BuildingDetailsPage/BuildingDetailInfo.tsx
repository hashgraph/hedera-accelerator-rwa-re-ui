import { useTreasuryData } from "@/components/Payments/hooks";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import type { BuildingInfo } from "@/types/erc3643/types";
import { useParams } from "next/navigation";

export const BuildingDetailInfo = (props: BuildingInfo) => {
   const { id } = useParams();
   const { tokenAddress, treasuryAddress } = useBuildingInfo(id as string);
   const { tokenPriceInUSDC, totalSupply, balanceOf, isLoading } = useTokenInfo(tokenAddress);
   const { reserve } = useTreasuryData(treasuryAddress, id as string);

   if (isLoading) {
      return null;
   }
   const { demographics, financial } = props;

   return (
      <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2 mt-16">
         <div>
            <article className="prose">
               <h3 className="font-bold text-purple-700 text-xl">Financial</h3>
            </article>

            <div className="grid grid-cols-2 gap-2 mt-4">
               <span className="font-semibold text-sm">Percentage owned of Overall property:</span>
               <span className="text-sm">
                  {balanceOf === BigInt(0)
                     ? 0
                     : ((Number(balanceOf) / Number(totalSupply)) * 100).toFixed(2)}
                  %
               </span>
               {tokenPriceInUSDC !== 0 && (
                  <>
                     <span className="font-semibold text-sm">Token price:</span>
                     <span>
                        <span className="text-sm">{Number(tokenPriceInUSDC).toPrecision(3)}</span>
                        &nbsp;
                        <span className="text-xs text-gray-500">(USDC)</span>
                     </span>
                  </>
               )}
               {reserve && (
                  <>
                     <span className="font-semibold text-sm">Treasury reserve:</span>
                     <span>
                        <span className="text-sm">{reserve}</span>&nbsp;
                        <span className="text-xs text-gray-500">(USDC)</span>
                     </span>
                  </>
               )}
            </div>
         </div>

         <div>
            <article className="prose">
               <h3 className="font-bold text-purple-700 text-xl">Demographics</h3>
            </article>
            <div className="grid grid-cols-2 gap-2 mt-4">
               <span className="font-semibold text-sm">Constructed:</span>
               <span className="text-sm">{demographics.constructedYear}</span>
               <span className="font-semibold text-sm">Type:</span>
               <span className="text-sm">{demographics.type}</span>
               <span className="font-semibold text-sm">Location:</span>
               <span className="text-sm">{demographics.location}</span>
               <span className="font-semibold text-sm">Location Type:</span>
               <span className="text-sm">{demographics.locationType}</span>
            </div>
         </div>
      </div>
   );
};
