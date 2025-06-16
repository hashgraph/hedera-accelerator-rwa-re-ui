"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isEmpty, map } from "lodash";
import { UserClaimedReward } from "./types";
import { ScrollArea } from "../ui/scroll-area";

interface ClaimedRewardsCardProps {
   userClaimedRewards: UserClaimedReward[];
}

export default function ClaimedRewardsCard({ userClaimedRewards }: ClaimedRewardsCardProps) {
   return (
      <Card className="h-full flex flex-col">
         <CardHeader>
            <CardTitle>Claimed Rewards</CardTitle>
         </CardHeader>
         <CardContent className="flex-1">
            {isEmpty(userClaimedRewards) ? (
               <p className="text-center text-muted-foreground py-8">No claimed rewards yet</p>
            ) : (
               <ScrollArea className="h-64">
                  <div className="space-y-2">
                     {map(userClaimedRewards, (reward) => (
                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                           <div>
                              <p className="font-semibold text-indigo-900">{reward.symbol}</p>
                              <p className="text-sm text-indigo-700">Claimed reward</p>
                           </div>
                           <p className="text-lg font-bold text-indigo-900">
                              +{Number(reward.amount).toFixed(reward.decimals)}
                           </p>
                        </div>
                     ))}
                  </div>
               </ScrollArea>
            )}
         </CardContent>
      </Card>
   );
}
