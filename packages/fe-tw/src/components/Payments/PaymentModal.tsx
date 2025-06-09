"use client";

import { PaymentForm } from "./PaymentForm";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

interface PaymentModalProps {
   open: boolean;
   isSubmitting: boolean;
   buildingId: string;
   onOpenChange: (state: boolean) => void;
   onSubmit: (amount: string) => Promise<void>;
}

export function PaymentModal({
   open,
   isSubmitting,
   buildingId,
   onOpenChange,
   onSubmit,
}: PaymentModalProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Add Payment</DialogTitle>
               <DialogDescription>
                  Enter the amount of USDC you would like to contribute to Building {buildingId}.
               </DialogDescription>
            </DialogHeader>

            <PaymentForm
               isSubmitting={isSubmitting}
               buildingId={buildingId}
               onSubmit={onSubmit}
               onClose={() => onOpenChange(false)}
            />
         </DialogContent>
      </Dialog>
   );
}
