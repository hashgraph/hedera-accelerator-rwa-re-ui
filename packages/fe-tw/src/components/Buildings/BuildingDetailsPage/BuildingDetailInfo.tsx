import type { BuildingInfo } from "@/types/erc3643/types";

export const BuildingDetailInfo = (props: BuildingInfo) => {
   const { demographics, financial } = props;

   return (
      <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2 mt-16">
         {/* Financial Section */}
         <div>
            <article className="prose">
               <h3 className="font-bold text-purple-700 text-xl">Financial</h3>
            </article>

            <div className="grid grid-cols-2 gap-2 mt-4">
               <span className="font-semibold text-sm">Percentage Owned by overall property:</span>
               <span className="text-sm">{financial.percentageOwned}%</span>
               <span className="font-semibold text-sm">Token price:</span>
               <span className="text-sm">{financial.tokenPrice}$</span>
               <span className="font-semibold text-sm">Direct exposure:</span>
               <span className="text-sm">
                  {financial.directExposure} ({financial.directExposure * financial.tokenPrice}$)
               </span>
               <span className="font-semibold text-sm">Yield:</span>
               <span className="text-sm">
                  {financial.yield.map((yi) => (
                     <span key={yi.percentage} className="text-sm">
                        {yi.percentage}% ({yi.days} days)
                     </span>
                  ))}
               </span>
               <span className="font-semibold text-sm">Treasury:</span>
               <span className="text-sm">
                  {financial.treasury} ({financial.treasury * financial.tokenPrice}$)
               </span>
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
