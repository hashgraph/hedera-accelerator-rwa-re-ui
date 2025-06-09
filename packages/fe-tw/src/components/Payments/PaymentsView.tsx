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
   const { data, payments, isSubmittingPayment, handleAddPayment } = useTreasuryData(treasuryAddress);
   const [showPaymentModal, setShowPaymentModal] = useState(false);

   return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
               <p className="text-gray-500 text-base mt-1">
                  Manage all incoming DAO revenue and contributions
               </p>
            </div>

            {data && (
               <div className="text-right">
                  <p className="text-gray-500 text-base">Treasury Balance</p>
                  <p className="text-2xl font-semibold">{data} USDC</p>
               </div>
            )}
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
                     <TableRow key={`${payment.id}-${payment.revenueType}-${payment.amount}`}>
                        <TableCell>{moment(payment.date).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                        <TableCell>{payment.revenueType}</TableCell>
                        <TableCell>{payment.notes || "--"}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
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
         />
      </div>
   );
}
