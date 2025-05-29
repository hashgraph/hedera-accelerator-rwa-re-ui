"use client";

import { useExpensesData } from "@/hooks/useExpensesData";
import moment from "moment";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

const useTreasuryData = () => {};

type ExpensesViewProps = {
   buildingId: string;
};

export function ExpensesView({ buildingId }: ExpensesViewProps) {
   const { data } = useTreasuryData();
   const { expenses, isLoading, isError, addExpense } = useExpensesData(buildingId);
   const [showModal, setShowModal] = useState(false);

   async function handleExpenseCompleted(expenseData: {
      title: string;
      amount: number;
      expenseType: "once-off" | "recurring";
      method: "flat" | "percentage";
      period?: number;
      endDate?: Date;
      percentage?: number;
      notes?: string;
   }) {
      try {
         await addExpense(expenseData);

         setShowModal(false);
      } catch (err) {
         console.error("Error adding expense record:", err);
         alert("Could not add expense record. See console.");
      }
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
               <p className="text-gray-500 text-base mt-1">
                  Submit and track building expenses paid from the treasury
               </p>
            </div>

            {data && (
               <div className="text-right">
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">{data.balance.toLocaleString()} USDC</p>
               </div>
            )}
         </div>

         <div className="bg-white rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Expense History</h2>

            {isLoading && <p className="text-base text-gray-500">Loading expenses...</p>}
            {isError && <p className="text-base text-red-500">Error fetching expenses!</p>}

            {!isLoading && !isError && expenses && expenses.length === 0 ? (
               <p className="text-base text-gray-500">No expenses recorded yet.</p>
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {expenses?.map((expense) => (
                        <TableRow key={expense.id}>
                           <TableCell>
                              {moment(expense.dateCreated).format("YYYY-MM-DD HH:mm")}
                           </TableCell>
                           <TableCell>{expense.title}</TableCell>
                           <TableCell>{expense.amount} USDC</TableCell>
                           <TableCell>{expense.expenseType}</TableCell>
                           <TableCell>{expense.method}</TableCell>
                           <TableCell>{expense.notes || "No notes"}</TableCell>
                           <TableCell>
                              <Badge>Success</Badge>
                           </TableCell>
                           <TableCell>
                              <Button variant="outline" size="sm" type="button">
                                 Details
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            )}
         </div>

         <div className="flex justify-end">
            <Button type="button" onClick={() => setShowModal(true)}>
               Add Expense
            </Button>
         </div>

         <ExpenseModal
            open={showModal}
            buildingId={buildingId}
            onOpenChange={() => setShowModal(false)}
            onExpenseCompleted={handleExpenseCompleted}
         />
      </div>
   );
}

function ExpenseModal({
   open,
   buildingId,
   onOpenChange,
   onExpenseCompleted,
}: {
   open: boolean;
   buildingId: string;
   onOpenChange: (state: boolean) => void;
   onExpenseCompleted: (expenseData: {
      title: string;
      amount: number;
      expenseType: "once-off" | "recurring";
      method: "flat" | "percentage";
      period?: number;
      endDate?: Date;
      percentage?: number;
      notes?: string;
   }) => Promise<void>;
}) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Add Expense</DialogTitle>
               <DialogDescription>
                  Submit an expense. If approved, a payment is made from the treasury.
               </DialogDescription>
            </DialogHeader>

            <ExpenseForm buildingId={buildingId} onCompleted={onExpenseCompleted} />
         </DialogContent>
      </Dialog>
   );
}
