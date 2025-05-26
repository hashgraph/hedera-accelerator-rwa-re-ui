"use client";

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
import { tryCatch } from "@/services/tryCatch";

type PaymentFormProps = {
   isSubmitting: boolean;
   onSubmit?: (amount: number) => void;
   onClose: () => void;
};

export function PaymentForm({ isSubmitting, onSubmit, onClose }: PaymentFormProps) {
   const [amount, setAmount] = useState("");
   const [revenueType, setRevenueType] = useState("rental");
   const [notes, setNotes] = useState("");

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const { error } = await tryCatch(onSubmit(amount));

      if (!error) {
         toast.success(`Payment of ${amount} USDC submitted to treasury.`);
         setAmount("");
         setNotes("");
         onClose();
      } else {
         toast.error(`Error submitting payment: ${error}`);
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

         <div className="hidden">
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

         <div className="hidden">
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

         <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Submit Payment
         </Button>
      </form>
   );
}
