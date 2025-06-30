"use client";

import { useBuildingTreasury } from "@/hooks/useBuildingTreasury";
import moment from "moment";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { tryCatch } from "@/services/tryCatch";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseRecord } from "@/consts/treasury";
import { PaymentRequestPayload } from "@/types/erc3643/types";
import { StorageKeys, storageService } from "@/services/storageService";
import { toast } from "sonner";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { Badge } from "@/components/ui/badge";
import { TransactionExtended } from "@/types/common";

type ExpensesViewProps = {
   buildingAddress: `0x${string}`;
};

type ExpensesModalProps = {
   treasuryBalance?: number;
   open: boolean;
   buildingAddress: `0x${string}`;
   onOpenChange: (state: boolean) => void;
   handleExpenseSubmitted: (
      data: PaymentRequestPayload,
      actions: { resetForm: () => void },
   ) => Promise<void>;
};

export function ExpensesView({ buildingAddress }: ExpensesViewProps) {
   const { treasuryData, expenses, isError, isLoading, makePayment } =
      useBuildingTreasury(buildingAddress);
   const [showModal, setShowModal] = useState(false);

   const onSubmitExpense = async (
      values: PaymentRequestPayload,
      actions: { resetForm: () => void },
   ) => {
      const { data, error } = await tryCatch<TransactionExtended, any>(makePayment(values));

      if (error) {
         toast.error(<TxResultToastView title="Error submitting expense" txError={error.tx} />, {
            duration: Infinity,
         });
         actions.resetForm();
         return;
      }

      if (data) {
         toast.success(
            <TxResultToastView title="Expense submitted successfully!" txSuccess={data} />,
         );

         setShowModal(false);
      } else {
         actions.resetForm();
      }
   };

   return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="self-start">
               <p className="text-gray-500 text-base mt-1">
                  Submit and track building expenses paid from the treasury
               </p>
            </div>

            {!!treasuryData && (
               <div className="text-right">
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">{treasuryData.balance} USDC</p>
               </div>
            )}
         </div>

         <div className="bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Expenses History</h2>

            {isLoading && <p className="text-base text-gray-500">Loading expenses...</p>}
            {isError && <p className="text-base text-red-500">Error fetching expenses!</p>}

            {!isLoading && !isError && expenses.length === 0 ? (
               <p className="text-base text-gray-500">No expenses recorded yet.</p>
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {expenses?.map((expense) => (
                        <TableRow
                           key={`${expense.amount}-${expense.receiver}-${expense.dateCreated}`}
                        >
                           <TableCell>
                              {moment(expense.dateCreated).format("YYYY-MM-DD HH:mm:ss")}
                           </TableCell>
                           <TableCell>{expense.title}</TableCell>
                           <TableCell>{expense.notes || "--"}</TableCell>
                           <TableCell>{expense.amount} USDC</TableCell>
                           <TableCell>
                              <Badge className="text-md">Success</Badge>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            )}
         </div>

         <div className="flex justify-end mt-10">
            <Button
               type="button"
               onClick={() => setShowModal(true)}
               disabled={!treasuryData?.balance}
            >
               Submit New Expense
            </Button>
         </div>

         <ExpenseModal
            treasuryBalance={treasuryData?.balance}
            open={showModal}
            buildingAddress={buildingAddress}
            onOpenChange={() => setShowModal(false)}
            handleExpenseSubmitted={onSubmitExpense}
         />
      </div>
   );
}

function ExpenseModal({ open, onOpenChange, handleExpenseSubmitted }: ExpensesModalProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Add Building Expense</DialogTitle>
               <DialogDescription>
                  Submit an expense. If approved, a payment is made from the treasury.
               </DialogDescription>
            </DialogHeader>
            <ExpenseForm handlePayment={handleExpenseSubmitted} />
         </DialogContent>
      </Dialog>
   );
}
