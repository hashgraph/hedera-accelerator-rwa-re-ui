"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
   claimableRewards: string;
   tvl: string;
}

export default function InfoCard({ claimableRewards, tvl }: InfoCardProps) {
   return (
      <Card className="h-full flex flex-col">
         <CardHeader>
            <CardTitle>Staking Info</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4 flex-1">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
               <span className="font-semibold text-gray-900">Claimable Rewards</span>
               <span className="text-lg font-bold text-gray-900">
                  ${claimableRewards ? claimableRewards : "0.00"}
               </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
               <span className="font-semibold text-gray-900">TVL</span>
               <span className="text-lg font-bold text-gray-900">${tvl ? tvl : "0.00"}</span>
            </div>
         </CardContent>
      </Card>
   );
}
