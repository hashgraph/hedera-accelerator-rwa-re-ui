"use client";

import { type Proposal, ProposalType } from "@/types/props";

type ProposalDetailsProps = {
   proposal: Proposal;
};

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
   if (proposal.propType === ProposalType.PaymentProposal) {
      return (
         <p className="text-sm text-purple-700">
            Payment to: <strong>{proposal.to}</strong> <br /> for <strong>${proposal.amount}</strong>
         </p>
      );
   }

   return null;
}
