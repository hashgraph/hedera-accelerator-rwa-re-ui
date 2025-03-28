"use client";

import { usePaymentsData } from "@/hooks/usePaymentsData";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import moment from "moment";
import { useState } from "react";
import { PaymentForm } from "./PaymentForm";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

type PaymentsViewProps = {
   buildingId: string;
};

export function PaymentsView({ buildingId }: PaymentsViewProps) {
   const { data } = useTreasuryData();
   const { payments, isLoading, isError, addPayment } = usePaymentsData(buildingId);

   const [showPaymentModal, setShowPaymentModal] = useState(false);

   async function handlePaymentCompleted(amount: number, revenueType: string, notes: string) {
      try {
         await addPayment({ amount, revenueType, notes });
         setShowPaymentModal(false);
      } catch (err) {
         console.error("Error adding payment record:", err);
         alert("Error adding payment record. Check console.");
      }
   }

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
               <p className="text-gray-500 text-base mt-1">
                  Manage all incoming DAO revenue and contributions
               </p>
            </div>

            {data && (
               <div className="text-right">
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">{data.balance.toLocaleString()} USDC</p>
               </div>
            )}
         </div>

         <div className="bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>

            {isLoading && <p className="text-base text-gray-500">Loading payments...</p>}
            {isError && <p className="text-base text-red-500">Error fetching payments!</p>}

            {!isLoading && !isError && payments && payments.length === 0 ? (
               <p className="text-base text-gray-500">No payments recorded yet.</p>
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Revenue Type</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {payments?.map((payment) => (
                        <TableRow key={payment.id}>
                           <TableCell>{moment(payment.date).format("YYYY-MM-DD HH:mm")}</TableCell>
                           <TableCell>
                              <Badge>Success</Badge>
                           </TableCell>
                           <TableCell>{payment.revenueType}</TableCell>
                           <TableCell>{payment.notes || "No notes"}</TableCell>
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
            <Button type="button" onClick={() => setShowPaymentModal(true)}>
               Add Payment
            </Button>
         </div>

         <PaymentModal
            open={showPaymentModal}
            buildingId={buildingId}
            onOpenChange={(state) => setShowPaymentModal(state)}
            onPaymentCompleted={handlePaymentCompleted}
         />
      </div>
   );
}

function PaymentModal({
   open,
   buildingId,
   onOpenChange,
   onPaymentCompleted,
}: {
   open: boolean;
   buildingId: string;
   onOpenChange: (state: boolean) => void;
   onPaymentCompleted: (amount: number, revenueType: string, notes: string) => Promise<void>;
}) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Add Payment</DialogTitle>
               <DialogDescription>
                  Enter the amount of USDC you would like to contribute to Building {buildingId}.
               </DialogDescription>
            </DialogHeader>

            <PaymentForm buildingId={buildingId} onCompleted={onPaymentCompleted} />
         </DialogContent>
      </Dialog>
   );
}
