"use client";

import moment from "moment";
import { useState } from "react";
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
import { readBuildingDetails } from "@/hooks/useBuildings";
import { useQuery } from "@tanstack/react-query";
import { useTreasuryData } from "./hooks";
import { PaymentModal } from "./PaymentModal";

type PaymentsViewProps = {
   buildingId: `0x${string}`;
};

export function PaymentsView({ buildingId }: PaymentsViewProps) {
   const { data: treasuryAddress } = useQuery({
      queryKey: ["BUILDING_DETAILS", buildingId],
      queryFn: () => readBuildingDetails(buildingId),
      select: (data) => data[0][5],
   });
   const { data, payments, reserve, isSubmittingPayment, handleAddPayment, refreshPayments } =
      useTreasuryData(treasuryAddress, buildingId);
   const [showPaymentModal, setShowPaymentModal] = useState(false);

   return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="self-start">
               <p className="text-gray-500 text-base mt-1">
                  Manage all incoming DAO revenue and contributions
               </p>
            </div>

            <div className="text-right space-y-2">
               <div>
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">
                     {data !== undefined ? `${data} USDC` : "Loading..."}
                  </p>
               </div>
               {reserve && (
                  <div>
                     <p className="text-gray-500 text-sm">Reserve Limit</p>
                     <p className="text-lg font-medium text-blue-600">{reserve} USDC</p>
                     <p className="text-xs text-gray-400 max-w-48">
                        {data === reserve
                           ? "Reserve limit reached - all new funds will be distributed to stakers"
                           : "Excess funds automatically distributed to stakers"}
                     </p>
                  </div>
               )}
            </div>
         </div>

         <div className="bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>

            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Revenue Type</TableHead>
                     <TableHead>Notes</TableHead>
                     <TableHead>Amount</TableHead>
                     <TableHead>Status</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {payments?.map((payment) => (
                     <TableRow
                        key={`${payment.id}-${payment.revenueType || "payment"}-${payment.amount}-${payment.dateCreated}`}
                     >
                        <TableCell>
                           {moment(payment.dateCreated || payment.date).format(
                              "YYYY-MM-DD HH:mm:ss",
                           )}
                        </TableCell>
                        <TableCell>{payment.revenueType || "General"}</TableCell>
                        <TableCell>{payment.notes || "--"}</TableCell>
                        <TableCell>{payment.amount} USDC</TableCell>
                        <TableCell>
                           <Badge className="text-md">Success</Badge>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         <div className="flex justify-end mt-10">
            <Button type="button" onClick={() => setShowPaymentModal(true)}>
               Add Payment
            </Button>
         </div>

         <PaymentModal
            buildingId={buildingId}
            open={showPaymentModal}
            isSubmitting={isSubmittingPayment}
            onOpenChange={(state) => setShowPaymentModal(state)}
            onSubmit={(amount) => handleAddPayment(amount)}
            onSuccess={refreshPayments}
         />
      </div>
   );
}
