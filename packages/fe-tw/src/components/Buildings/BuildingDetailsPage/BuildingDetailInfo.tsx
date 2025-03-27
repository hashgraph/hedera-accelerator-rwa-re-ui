import type { BuildingInfo } from "@/types/erc3643/types";

export const BuildingDetailInfo = (props: BuildingInfo) => {
   const { demographics, financial } = props;

   return (
      <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2 mt-16">
         {/* Financial Section */}
         <div>
            <article className="prose">
               <h3 className="font-semibold text-slate-700">Financial</h3>
            </article>

            <div className="grid grid-cols-2 gap-2 mt-4">
               <span className="font-semibold">Percentage Owned by overall property:</span>
               <span>{financial.percentageOwned}%</span>
               <span className="font-semibold">Token price:</span>
               <span>{financial.tokenPrice}$</span>
               <span className="font-semibold">Direct exposure:</span>
               <span>
                  {financial.directExposure} ({financial.directExposure * financial.tokenPrice}$)
               </span>
               <span className="font-semibold">Yield:</span>
               <span>
                  {financial.yield.map((yi) => (
                     <span key={yi.percentage}>
                        {yi.percentage}% ({yi.days} days)
                     </span>
                  ))}
               </span>
               <span className="font-semibold">Treasury:</span>
               <span>
                  {financial.treasury} ({financial.treasury * financial.tokenPrice}$)
               </span>
            </div>
         </div>

         <div>
            <article className="prose">
               <h3 className="font-semibold text-slate-700">Demographics</h3>
            </article>
            <div className="grid grid-cols-2 gap-2 mt-4">
               <span className="font-semibold">Constructed:</span>
               <span>{demographics.constructedYear}</span>
               <span className="font-semibold">Type:</span>
               <span>{demographics.type}</span>
               <span className="font-semibold">Location:</span>
               <span>{demographics.location}</span>
               <span className="font-semibold">Location Type:</span>
               <span>{demographics.locationType}</span>
            </div>
         </div>
      </div>
   );
};
