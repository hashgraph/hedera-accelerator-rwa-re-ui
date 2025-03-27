"use client";

import APRChart from "./APRChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RewardsDetailsProps = {
   currentAPR: number;
   tvl: number;
   aprData: { date: string; apr: number }[];
};

export default function RewardsDetails({ currentAPR, tvl, aprData }: RewardsDetailsProps) {
   return (
      <Card className="flex flex-auto">
         <CardHeader>
            <CardTitle>Rewards &amp; Details</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto h-64">
            <p className="text-sm mb-2">
               <span className="font-semibold">Claimable vTOKEN:</span> $0.00
            </p>
            <p className="text-sm mb-2">
               <span className="font-semibold">TVL:</span> $
               {tvl.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               })}
            </p>
            <p className="text-sm">
               <span className="font-semibold">Approximate APR:</span> {currentAPR.toFixed(2)}%
            </p>

            <APRChart data={aprData} />
         </CardContent>
      </Card>
      // <div className="card bg-gray-100 rounded-lg shadow-sm p-4">
      //    <h2 className="card-title text-black mb-2">Rewards &amp; Details</h2>
      //    <p className="text-sm mb-2">
      //       <span className="font-semibold">Claimable vTOKEN:</span> $0.00
      //    </p>
      //    <p className="text-sm mb-2">
      //       <span className="font-semibold">TVL:</span> $
      //       {tvl.toLocaleString(undefined, {
      //          minimumFractionDigits: 2,
      //          maximumFractionDigits: 2,
      //       })}
      //    </p>
      //    <p className="text-sm">
      //       <span className="font-semibold">Approximate APR:</span> {currentAPR.toFixed(2)}%
      //    </p>
      //
      //    <div className="mt-4 bg-white rounded-lg p-4">
      //       <APRChart data={aprData} />
      //    </div>
      // </div>
   );
}
