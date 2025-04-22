"use client";

import { type Proposal, ProposalState, ProposalType } from "@/types/props";

type Props = {
   proposal: Proposal;
   proposalState: ProposalState;
};

export function ProposalItemDetails({ proposal, proposalState }: Props) {
   if (proposal.propType === ProposalType.PaymentProposal) {
      return (
         <div className="flex flex-col">
            <p className="text-sm text-gray-800">
               Proposal type: {proposal.propType}
            </p>
            <p className="text-sm text-gray-800">
               Proposal state: {proposalState}
            </p>
            <br />
            <p className="text-sm text-purple-700">Pay to: {proposal.to}</p>
            <p className="text-sm text-purple-700">Pay amount: {proposal.amount}</p>
         </div>
      );
   } else if (proposal.propType === ProposalType.ChangeReserveProposal) {
      return (
         <div className="flex flex-col">
            <p className="text-sm text-gray-800">
               Proposal type: {proposal.propType}
            </p>
            <p className="text-sm text-gray-800">
               Proposal state: {proposalState}
            </p>
            <br />
            <p className="text-sm text-purple-700">Pay amount: {proposal.amount}</p>
         </div>
      );
   } else {
      return (
         <div className="flex flex-col">
            <p className="text-sm text-gray-800">
               Proposal type: {proposal.propType}
            </p>
            <p className="text-sm text-gray-800">
               Proposal state: {proposalState}
            </p>
         </div>
      );
   }
}
