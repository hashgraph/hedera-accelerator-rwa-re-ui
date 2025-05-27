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
      const { data, error } = await tryCatch(onStake({ amount: Number(amount) }));

      if (data) {
         toast.success(
            <div className="flex flex-col">
               <p>Successfully staked {amount} tokens!</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${data.approveTx.consensus_timestamp}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View allowance transaction
               </a>

               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${data.depositTx.consensus_timestamp}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View deposit transaction
               </a>
            </div>,
            {
               duration: 10000,
               closeButton: true,
            },
         );
      }

      if (error) {
         toast.error(`Failed to stake tokens. ${error.details}`, {
            duration: Infinity,
            closeButton: true,
         });
      }
   };

   const handleUnstake = async () => {
      const { data: withdrawTx, error } = await tryCatch(onUnstake({ amount: Number(amount) }));

      if (withdrawTx) {
         toast.success(
            <div className="flex flex-col">
               <p>Successfully unstaked {amount} tokens!</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${withdrawTx.consensus_timestamp}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  View transaction
               </a>
            </div>,
            {
               duration: 10000,
               closeButton: true,
            },
         );
      }

      if (error) {
         toast.error(`Failed to unstake tokens. ${error.details}`, {
            duration: Infinity,
            closeButton: true,
         });
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
