"use client";

import { type Proposal, ProposalType } from "@/types/props";

type Props = {
   proposal: Proposal;
};

export function ProposalDetails({ proposal }: Props) {
   const expiryBlock = null; {/** <p className="text-xs text-gray-500">
      {concluded
         ? `Ended: ${moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}`
         : `Ends: ${moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}`}
   </p> **/}

   if (proposal.propType === ProposalType.PaymentProposal) {
      return (
         <>
            <p className="text-sm text-purple-700">
               Payment to: <strong>{proposal.to}</strong> <br />
               for <strong>{proposal.amount}</strong>
            </p>
            {expiryBlock}
         </>
      );
   } else if (proposal.propType === ProposalType.ChangeReserveProposal) {
      return (
         <>
            <p className="text-sm text-purple-700">
               Amount: <strong>{proposal.amount}</strong>
            </p>
            {expiryBlock}
         </>
      );
   }

   return null;
}
