"use client";

import { useTreasuryData } from "@/hooks/useTreasuryData";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PaymentFormProps = {
   buildingId: string;
   onCompleted?: (amount: number, revenueType: string, notes: string) => void;
};

export function PaymentForm({ buildingId, onCompleted }: PaymentFormProps) {
   const [amount, setAmount] = useState("");
   const [revenueType, setRevenueType] = useState("rental");
   const [notes, setNotes] = useState("");

   const { deposit } = useTreasuryData();

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const amt = Number.parseFloat(amount);
      if (Number.isNaN(amt) || amt <= 0) {
         toast.error("Invalid amount");
         return;
      }

      try {
         await deposit(amt);
         toast.success(`Payment of ${amt} USDC submitted to treasury as ${revenueType} revenue.`);

         if (onCompleted) {
            onCompleted(amt, revenueType, notes);
         }
         setAmount("");
         setRevenueType("rental");
         setNotes("");
      } catch (err) {
         toast.error(`Error depositing to treasury: ${err}`);
      }
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 space-y-4">
         <div>
            <Label htmlFor="amount">Amount (USDC)</Label>
            <Input
               id="amount"
               type="number"
               step="0.01"
               min="0"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               placeholder="Enter amount in USDC"
               className="mt-1"
               required
            />
         </div>

         <div>
            <Label htmlFor="revenueType">Revenue Type</Label>

            <Select>
               <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Revenue type" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="parking">Parking Fees</SelectItem>
                  <SelectItem value="advertising">Advertising Revenue</SelectItem>
                  <SelectItem value="service">Service Charges</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div>
            <Label htmlFor="notes">Notes (Memo)</Label>
            <Textarea
               id="notes"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Optional memo..."
               className="mt-1"
               rows={3}
            />
         </div>

         <Button type="submit">Submit Payment</Button>
      </form>
   );
}
