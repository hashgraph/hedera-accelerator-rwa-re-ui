"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/services/tryCatch";

type ManageStakeProps = {
   disabled: boolean;
   isDepositing: boolean;
   isWithdrawing: boolean;
   onStake: ({ amount }: { amount: number }) => Promise<void>;
   onUnstake: ({ amount }: { amount: number }) => Promise<void>;
};

export default function ManageStake({
   disabled,
   isDepositing,
   isWithdrawing,
   onStake,
   onUnstake,
}: ManageStakeProps) {
   const [amount, setAmount] = useState("");

   const handleStake = async () => {
      const { error } = await tryCatch(onStake({ amount: Number(amount) }));

      if (error) {
         toast.error(`Failed to stake tokens. ${error.details}`);
      }
   };

   const handleUnstake = async () => {
      const { error } = await tryCatch(onUnstake({ amount: Number(amount) }));

      if (error) {
         toast.error(`Failed to unstake tokens. ${error.details}`);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Manage Your Stack</CardTitle>
            <CardDescription>
               Stake or unstake your tokens to earn rewards and participate in governance.
            </CardDescription>
         </CardHeader>
         <CardContent className="flex flex-col flex-auto gap-4">
            <div>
               <Label htmlFor="amount">Amount</Label>
               <Input
                  min={0}
                  disabled={disabled || isDepositing || isWithdrawing}
                  type="number"
                  placeholder="Amount"
                  className="mt-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
               />
            </div>
            <div className="flex gap-4 justify-end mt-auto">
               <Button
                  isLoading={isWithdrawing}
                  disabled={disabled || isDepositing || isWithdrawing}
                  type="button"
                  variant="outline"
                  onClick={handleUnstake}
               >
                  Unstake
               </Button>
               <Button
                  isLoading={isDepositing}
                  disabled={disabled || isDepositing || isWithdrawing}
                  type="button"
                  onClick={handleStake}
               >
                  Stake
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
