"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/services/tryCatch";
import { Switch } from "../ui/switch";
import { FormInput } from "../ui/formInput";
import { Info } from "lucide-react";

type ManageStakeProps = {
   disabled: boolean;
   isDepositing: boolean;
   isWithdrawing: boolean;
   autoCompounderAddress?: string;
   aTokenExchangeRate?: number;
   onStake: ({ amount }: { amount: number; isAutoCompounder: boolean }) => Promise<void>;
   onUnstake: ({ amount }: { amount: number; isAutoCompounder: boolean }) => Promise<void>;
};

export default function ManageStake({
   disabled,
   isDepositing,
   isWithdrawing,
   autoCompounderAddress,
   aTokenExchangeRate,
   onStake,
   onUnstake,
}: ManageStakeProps) {
   const [amount, setAmount] = useState("");
   const [isAutoCompounder, setIsAutoCompounder] = useState(false);

   const handleStake = async () => {
      const { data, error } = await tryCatch(onStake({ amount: Number(amount), isAutoCompounder }));

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
      const { data: withdrawTx, error } = await tryCatch(
         onUnstake({ amount: Number(amount), isAutoCompounder }),
      );

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
               <FormInput
                  label="Amount"
                  description="Amount of building tokens to stake or unstake"
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={disabled || isDepositing || isWithdrawing}
               />
            </div>
            {autoCompounderAddress && (
               <>
                  <div className="flex items-center space-x-2">
                     <Switch
                        id="autocompound-rewards"
                        checked={isAutoCompounder}
                        onCheckedChange={(checked) => setIsAutoCompounder(checked)}
                     />
                     <Label htmlFor="autocompound-rewards">Autocompound rewards</Label>
                  </div>

                  {isAutoCompounder && (
                     <div className="flex items-center gap-2 border-1 border-indigo-200 bg-indigo-50 p-3 rounded-lg">
                        <Info className="text-indigo-400" />
                        <p className="text-sm text-gray-600">
                           aToken exchange rate: {aTokenExchangeRate?.toFixed(2)} rate
                        </p>
                     </div>
                  )}
               </>
            )}
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
