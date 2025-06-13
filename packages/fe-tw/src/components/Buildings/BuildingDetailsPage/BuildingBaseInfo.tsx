"use client";

import { toast } from "sonner";
import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import type { BuildingData } from "@/types/erc3643/types";
import moment from "moment";
import { CheckCheck, TriangleAlert, Fingerprint } from "lucide-react";
import { getBuildingStateSummary, useBuildingInfo } from "@/hooks/useBuildingInfo";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { every, map, startCase } from "lodash";
import { Button } from "@/components/ui/button";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { MetamaskConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { addTokenToMM, getTokenDecimals, getTokenSymbol } from "@/services/erc20Service";

export const BuildingBaseInfo = ({
   id,
   imageUrl,
   title,
   purchasedAt,
   description,
}: BuildingData) => {
   const buildingInfo = useBuildingInfo(id as string);
   const buildingState = getBuildingStateSummary(buildingInfo);
   const buildingComplete = every(buildingState, (value) => value);
   const { isConnected: isMetamaskConnected } = useWallet(MetamaskConnector);

   const handleAddTokensToMM = async () => {
      const tokenDecimals = (await getTokenDecimals(buildingInfo.tokenAddress as `0x${string}`))[0];
      const tokenSymbol = (await getTokenSymbol(buildingInfo.tokenAddress as `0x${string}`))[0];
      
      if (isMetamaskConnected) {
         try {
            await addTokenToMM({
               tokenDecimals: tokenDecimals.toString(),
               tokenAddress: buildingInfo.tokenAddress as `0x${string}`,
               tokenSymbol: tokenSymbol,
               tokenType: 'ERC20',
            });
            
            toast.success('Token added successfully');
         } catch (err: any) {
            toast.error(`Error during adding tokens ${err?.message ?? ''}`);
         }
      }
   };

   return (
      <div className="flex flex-col md:flex-row bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
         <ReusableAvatar size="extra-lg" imageSource={imageUrl} imageAlt={title} isRounded />

         <div className="flex flex-col mt-6 md:mt-0 md:ml-10">
            <article className="prose">
               <div className="flex flex-row items-baseline gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>

                  {!buildingInfo.isLoading && (
                     <HoverCard>
                        <HoverCardTrigger>
                           {buildingComplete ? (
                              <CheckCheck className="text-violet-700 cursor-pointer" />
                           ) : (
                              <TriangleAlert className="text-orange-700 cursor-pointer" />
                           )}
                        </HoverCardTrigger>
                        <HoverCardContent>
                           <h3>Building setup is {buildingComplete ? "" : "not"} completed.</h3>
                           <ul className="mt-4">
                              {map(buildingState, (value, key) => (
                                 <li
                                    className="grid grid-cols-[1fr_auto] gap-2 items-center text-sm"
                                    key={key}
                                 >
                                    <span>{startCase(key)}</span>
                                    {value ? (
                                       <CheckCheck size={16} className="text-violet-500" />
                                    ) : (
                                       <TriangleAlert size={16} className="text-orange-500" />
                                    )}
                                 </li>
                              ))}
                           </ul>
                        </HoverCardContent>
                     </HoverCard>
                  )}
               </div>
               <p className="text-sm text-slate-700 mt-2">
                  Purchased at: {moment(purchasedAt).format("YYYY-MM-DD")}
               </p>
            </article>
            {description && (
               <article className="mt-4">
                  {description.split("\\").map((line) => (
                     <p className="mt-2 text-sm sm:text-base" key={line}>
                        {line}
                     </p>
                  ))}
               </article>
            )}
            <Button
               className="mt-4"
               variant="default"
               onClick={handleAddTokensToMM}
               disabled={!isMetamaskConnected || !buildingInfo.tokenAddress}
            >
               Add <span className="font-bold">{buildingInfo.tokenName}</span> to MM
               <Fingerprint className="cursor-pointer" />
            </Button>
         </div>
      </div>
   );
};
