"use client";

import { stakingService } from "@/services/stakingService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ManageStakeProps = {
   buildingId: string;
   onStake: (amount: number) => Promise<void>;
   onUnstake: (amount: number) => Promise<void>;
};

export default function ManageStake({ buildingId, onStake, onUnstake }: ManageStakeProps) {
   const [amount, setAmount] = useState("");
   const [tokenPrice, setTokenPrice] = useState(0);
   const [totalTokens, setTotalTokens] = useState(0);

   const stakeAmount = Number.parseFloat(amount) || 0;
   const stakeValueUSD = stakeAmount * tokenPrice;
   const stakePercentage = totalTokens ? (stakeAmount / totalTokens) * 100 : 0;

   useEffect(() => {
      async function fetchTokenDetails() {
         try {
            const vTokenRate = await stakingService.getVTokenExchangeRate(buildingId);
            const tvl = await stakingService.getTVL(buildingId);
            const totalTokens = tvl / vTokenRate;

            setTokenPrice(vTokenRate);
            setTotalTokens(totalTokens);
         } catch (err: any) {
            toast.error(`Error fetching token details: ${err?.message || err}`);
         }
      }
      fetchTokenDetails();
   }, [buildingId]);

   const handleStake = async () => {
      if (stakeAmount <= 0) {
         toast.error("Invalid stake amount");
         return;
      }
      try {
         await onStake(stakeAmount);
         toast.success(`Staked ${stakeAmount} tokens successfully!`);
      } catch (err: any) {
         toast.error(`Error staking tokens: ${err?.message || err}`);
      }
   };

   const handleUnstake = async () => {
      if (stakeAmount <= 0) {
         toast.error("Invalid unstake amount");
         return;
      }
      try {
         await onUnstake(stakeAmount);
         toast.success(`Unstaked ${stakeAmount} tokens successfully!`);
      } catch (err: any) {
         toast.error(`Error unstaking tokens: ${err?.message || err}`);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Manage Your Stack</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto">
            <div>
               <Label htmlFor="amount">Amount</Label>
               <Input
                  type="number"
                  placeholder="Amount"
                  className="mt-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
               />
            </div>

            <div className="mt-4">
               <p className="text-sm">
                  <span className="font-semibold">Proposed Stake Value:</span> $
                  {stakeValueUSD.toFixed(2)}
               </p>
               <p className="text-sm">
                  <span className="font-semibold">Stake Percentage:</span>{" "}
                  {stakePercentage.toFixed(2)}%
               </p>
            </div>

            <div className="flex gap-4 justify-end mt-auto">
               <Button type="button" variant="outline" onClick={handleUnstake}>
                  Unstake
               </Button>
               <Button type="button" onClick={handleStake}>
                  Stake
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
