"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { tryCatch } from "@/services/tryCatch";
import { Separator } from "../ui/separator";
import { cx } from "class-variance-authority";

interface InfoCardProps {
   claimableRewards: string;
   autoCompounderRewards: string;
   tvl: string;
   autoCompounderAddress?: string;
   onClaimVaultRewards: () => Promise<any>;
   onClaimAutoCompounderRewards: () => Promise<any>;
   onClaimAutoCompounderUserRewards: () => Promise<any>;
   isClaimingVault: boolean;
   isClaimingAutoCompounder: boolean;
   isClaimingAutoCompounderUserRewards: boolean;
}

export default function InfoCard({
   claimableRewards,
   autoCompounderRewards,
   tvl,
   autoCompounderAddress,
   onClaimVaultRewards,
   onClaimAutoCompounderRewards,
   onClaimAutoCompounderUserRewards,
   isClaimingVault,
   isClaimingAutoCompounder,
   isClaimingAutoCompounderUserRewards,
}: InfoCardProps) {
   const handleClaimVaultRewards = async () => {
      const { data, error } = await tryCatch(onClaimVaultRewards());

      if (data) {
         toast.success(
            <div className="flex flex-col">
               <p>Successfully claimed vault rewards!</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${data.consensus_timestamp}`}
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
         toast.error(`Failed to claim vault rewards. ${error.details}`, {
            duration: Infinity,
            closeButton: true,
         });
      }
   };

   const handleClaimAutoCompounderRewards = async () => {
      const { data, error } = await tryCatch(onClaimAutoCompounderRewards());

      if (data) {
         toast.success(
            <div className="flex flex-col">
               <p>Successfully reinvested AutoCompounder rewards!</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${data.consensus_timestamp}`}
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
         toast.error(`Failed to claim autoCompounder rewards. ${error.details}`, {
            duration: Infinity,
            closeButton: true,
         });
      }
   };

   const handleClaimAutoCompounderUserRewards = async () => {
      const { data, error } = await tryCatch(onClaimAutoCompounderUserRewards());

      if (data) {
         toast.success(
            <div className="flex flex-col">
               <p>Successfully claimed AutoCompounder user rewards!</p>
               <a
                  className="text-blue-500"
                  href={`https://hashscan.io/testnet/transaction/${data.consensus_timestamp}`}
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
         toast.error(`Failed to claim autoCompounder user rewards. ${error.details}`, {
            duration: Infinity,
            closeButton: true,
         });
      }
   };

   return (
      <Card className="h-full flex flex-col">
         <CardHeader>
            <CardTitle>Staking Info</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4 flex-1">
            <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg gap-1">
                  <div>
                     <p className="font-semibold text-base text-gray-900">Vault Rewards</p>
                     <p className="text-sm text-gray-600">
                        ${claimableRewards ? claimableRewards : "0.00"}
                     </p>
                  </div>
                  {claimableRewards && claimableRewards !== "0" && claimableRewards !== "0.00" && (
                     <Button
                        size="sm"
                        variant="outline"
                        className="bg-indigo-50 border-indigo-200 text-indigo-700 "
                        onClick={handleClaimVaultRewards}
                        isLoading={isClaimingVault}
                        disabled={isClaimingVault}
                     >
                        Claim
                     </Button>
                  )}
               </div>

               {autoCompounderAddress && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg gap-1">
                     <div>
                        <p className="font-semibold text-wrap text-gray-900">
                           AutoCompounder Rewards
                        </p>
                        <p className="text-sm text-gray-600">
                           ${autoCompounderRewards ? autoCompounderRewards : "0.00"}
                        </p>
                     </div>
                     {autoCompounderRewards &&
                        autoCompounderRewards !== "0" &&
                        autoCompounderRewards !== "0.00" && (
                           <div
                              className={cx(
                                 "flex bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md",
                              )}
                           >
                              <Button
                                 size="sm"
                                 variant="ghost"
                                 className="rounded-none border-r-1 border-indigo-200 rounded-l-md"
                                 onClick={handleClaimAutoCompounderRewards}
                                 isLoading={isClaimingAutoCompounder}
                                 disabled={
                                    isClaimingAutoCompounder || isClaimingAutoCompounderUserRewards
                                 }
                              >
                                 Reinvest
                              </Button>
                              <Button
                                 size="sm"
                                 variant="ghost"
                                 className="rounded-none rounded-r-md"
                                 onClick={handleClaimAutoCompounderUserRewards}
                                 isLoading={isClaimingAutoCompounderUserRewards}
                                 disabled={
                                    isClaimingAutoCompounderUserRewards || isClaimingAutoCompounder
                                 }
                              >
                                 Claim
                              </Button>
                           </div>
                        )}
                  </div>
               )}
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
               <span className="font-semibold text-gray-900">TVL</span>
               <span className="text-lg font-bold text-gray-900">${tvl ? tvl : "0.00"}</span>
            </div>
         </CardContent>
      </Card>
   );
}
