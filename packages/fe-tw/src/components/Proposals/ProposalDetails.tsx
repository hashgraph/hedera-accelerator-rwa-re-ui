"use client";

import { type Proposal, ProposalType } from "@/types/props";

type ProposalDetailsProps = {
   proposal: Proposal;
};

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
   if (proposal.propType === ProposalType.PaymentProposal) {
      return (
         <p className="text-sm text-gray-500">
            Payment to: <strong>{proposal.to}</strong> for <strong>${proposal.amount}</strong>
         </p>
      );
   }

   if (proposal.propType === ProposalType.RecurringProposal) {
      return (
         <p className="text-sm text-gray-500">
            Recurring Payment: <strong>${proposal.amount}</strong> every{" "}
            <strong>{proposal.frequency} days</strong> for{" "}
            <strong>{proposal.numPayments} payments</strong>
         </p>
      );
   }

   return null;
}
