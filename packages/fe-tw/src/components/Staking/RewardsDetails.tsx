"use client";

import { ethers } from "ethers";
import APRChart from "./APRChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";

interface IProps {
   claimableRewards: string;
   aprData: { date: string; apr: number }[];
}

export default function RewardsDetails({ tvl, claimableRewards, aprData, claimedRewards }: IProps) {
   return (
      <Card className="flex flex-auto">
         <CardHeader>
            <CardTitle>Rewards &amp; Details</CardTitle>
         </CardHeader>
         <CardContent className="grid md:grid-cols-2 sm:grid-cols-1 h-64">
            <div>
               <p className="leading-7">Info</p>
               <p className="text-sm mb-2 mt-4">
                  <span className="font-semibold">Claimable Rewards:</span> $
                  {claimableRewards ? claimableRewards : "0.00"}
               </p>
               <p className="text-sm mb-2">
                  <span className="font-semibold">TVL:</span> ${tvl ? tvl : "0.00"}
               </p>
            </div>

            <div>
               <p className="leading-7 mb-4">Claimed Rewards</p>
               <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600">Reward</span>
                     <span className="text-sm font-semibold text-primary">+$52.33</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                     <span className="text-sm text-gray-600">Reward</span>
                     <span className="text-sm font-semibold text-primary">+$1.33</span>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
