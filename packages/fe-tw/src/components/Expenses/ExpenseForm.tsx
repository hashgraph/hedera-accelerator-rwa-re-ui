"use client";

import type { ExpenseMethod, ExpenseType } from "@/consts/treasury";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ExpenseFormProps = {
   buildingId: string;
   onCompleted?: (expenseData: {
      title: string;
      amount: number;
      expenseType: ExpenseType;
      method: ExpenseMethod;
      period?: number;
      endDate?: Date;
      percentage?: number;
      notes?: string;
   }) => void;
};

export function ExpenseForm({ buildingId, onCompleted }: ExpenseFormProps) {
   const [title, setTitle] = useState("");
   const [amount, setAmount] = useState("");
   const [expenseType, setExpenseType] = useState<ExpenseType>("once-off");
   const [method, setMethod] = useState<ExpenseMethod>("flat");
   const [period, setPeriod] = useState("");
   const [endDate, setEndDate] = useState("");
   const [percentage, setPercentage] = useState("");
   const [notes, setNotes] = useState("");

   const { makePayment } = useTreasuryData();

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      const amt = Number.parseFloat(amount);
      if (Number.isNaN(amt) || amt <= 0) {
         toast.error("Invalid expense amount");
         return;
      }

      try {
         await makePayment({ to: "0xExpenseRecipient", amount: amt });
         toast.success("Expense payment made from the treasury!");
      } catch (err) {
         toast.error(`Could not make treasury payment: ${err}`);
         return;
      }

      if (onCompleted) {
         onCompleted({
            title,
            amount: amt,
            expenseType,
            method,
            period: period ? Number.parseFloat(period) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            percentage: percentage ? Number.parseFloat(percentage) : undefined,
            notes,
         });
      }

      setTitle("");
      setAmount("");
      setExpenseType("once-off");
      setMethod("flat");
      setPeriod("");
      setEndDate("");
      setPercentage("");
      setNotes("");
   }

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <Label className="block mb-1 font-semibold" htmlFor="title">
               Expense Title
            </Label>
            <Input
               id="title"
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="mt-1"
               placeholder="e.g. Office Supplies"
               required
            />
         </div>

         <div>
            <Label className="block mb-1 font-semibold" htmlFor="amount">
               Amount (USDC)
            </Label>
            <Input
               id="amount"
               type="number"
               step="0.01"
               min="0"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="mt-1"
               placeholder="Enter amount in USDC"
               required
            />
         </div>

         <div>
            <Label className="block mb-1 font-semibold" htmlFor="expenseType">
               Expense Type
            </Label>
            <Select onValueChange={(value) => setExpenseType(value as ExpenseType)}>
               <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Expense type" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="once-off">Once-off</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {expenseType === "recurring" && (
            <>
               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="period">
                     Recurring Period (days)
                  </Label>
                  <Input
                     id="period"
                     type="number"
                     min="1"
                     value={period}
                     onChange={(e) => setPeriod(e.target.value)}
                     className="mt-1"
                     placeholder="e.g. 30"
                     required
                  />
               </div>

               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="endDate">
                     End Date
                  </Label>
                  <Input
                     id="endDate"
                     type="date"
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                     className="mt-1"
                     required
                  />
               </div>
            </>
         )}

         <div>
            <Label className="block mb-1 font-semibold" htmlFor="method">
               Expense Method
            </Label>

            <Select onValueChange={(value) => setMethod(value as ExpenseMethod)}>
               <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Expense method" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="flat">Flat Amount</SelectItem>
                  <SelectItem value="percentage">% of Revenue</SelectItem>
               </SelectContent>
            </Select>

            {/*<select*/}
            {/*   id="method"*/}
            {/*   value={method}*/}
            {/*   onChange={(e) => setMethod(e.target.value as ExpenseMethod)}*/}
            {/*   className="select select-bordered w-full"*/}
            {/*>*/}
            {/*   <option value="flat">Flat Amount</option>*/}
            {/*   <option value="percentage">% of Revenue</option>*/}
            {/*</select>*/}
         </div>

         {method === "percentage" && (
            <div>
               <Label className="block mb-1 font-semibold" htmlFor="percentage">
                  Percentage of Revenue (%)
               </Label>
               <Input
                  id="percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="mt-1"
                  placeholder="e.g. 10"
                  required
               />
            </div>
         )}

         <div>
            <Label className="block mb-1 font-semibold" htmlFor="notes">
               Notes (Memo)
            </Label>
            <Textarea
               id="notes"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Optional notes or memo..."
               rows={2}
               // style={{ resize: "vertical", maxHeight: "120px" }}
            />
         </div>

         <div className="flex justify-end">
            <Button type="submit">Submit Expense</Button>
         </div>
      </form>
   );
}
