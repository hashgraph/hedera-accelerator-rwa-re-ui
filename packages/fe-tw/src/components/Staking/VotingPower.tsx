"use client";

import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
   CardContent,
   CardAction,
   CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VotingPower({
   votingPower = 0,
   totalVotingPower = 1,
}: {
   votingPower?: number;
   totalVotingPower?: number;
}) {
   const percentage = ((votingPower / totalVotingPower) * 100).toFixed(2);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Voting Power</CardTitle>
            <CardDescription>
               Voting power reflects your influence in decision-making for the buildings you have
               staked tokens in. By staking tokens, you earn governance rights, allowing you to
               participate in key decisions such as treasury management, proposal approvals, and
               other operational aspects of the building's tokenized ecosystem.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="stats shadow-sm text-xs grid grid-cols-3 gap-4">
               <div className="stat">
                  <div className="stat-title whitespace-normal text-center">Your Voting Power</div>
                  <div className="stat-value text-sm text-center">
                     {votingPower.toLocaleString()} VP
                  </div>
               </div>
               <div className="stat">
                  <div className="stat-title whitespace-normal text-center">Total Voting Power</div>
                  <div className="stat-value text-sm text-center">
                     {totalVotingPower.toLocaleString()} VP
                  </div>
               </div>
               <div className="stat">
                  <div className="stat-title whitespace-normal text-center">Your Influence</div>
                  <div className="stat-value text-sm text-center">{percentage}%</div>
               </div>
            </div>
         </CardContent>

         <CardFooter>
            <Button className="w-full">Delegate Voting Power </Button>
         </CardFooter>
      </Card>
   );
}
