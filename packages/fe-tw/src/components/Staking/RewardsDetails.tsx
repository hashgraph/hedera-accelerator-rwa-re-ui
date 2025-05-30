"use client";

import { ethers } from "ethers";
import APRChart from "./APRChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IProps {
   claimableRewards: string;
   aprData: { date: string; apr: number }[];
   tvl?: number;
}

export default function RewardsDetails({ tvl, claimableRewards, aprData }: IProps) {
   return (
      <Card className="flex flex-auto">
         <CardHeader>
            <CardTitle>Rewards &amp; Details</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto h-64">
            <p className="text-sm mb-2">
               <span className="font-semibold">Claimable Rewards:</span> ${claimableRewards}
            </p>
            <p className="text-sm mb-2">
               <span className="font-semibold">TVL:</span> ${tvl}
            </p>

            <APRChart data={aprData} />
         </CardContent>
      </Card>
   );
}
