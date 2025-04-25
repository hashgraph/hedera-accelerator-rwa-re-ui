"use client";

import { type Proposal, ProposalState, ProposalType } from "@/types/props";
import { proposalStates, proposalTypes } from "./constants";

type Props = {
   proposal: Proposal;
   proposalState: ProposalState;
};

export function ProposalItemDetails({ proposal, proposalState }: Props) {
   return (
      <div className="flex flex-col">
         <p className="text-sm text-gray-800 font-bold">
            Proposal type: {proposalTypes[proposal.propType as ProposalType]}
         </p>
         {!!proposalState && <p className="text-sm text-gray-800 font-bold">
            Proposal state: {proposalStates[proposalState]}
         </p>}
         <br />
         {proposal.propType === ProposalType.ChangeReserveProposal && (
            <p className="text-sm text-purple-700">Pay amount: {proposal.amount}</p>
         )}
         {proposal.propType === ProposalType.PaymentProposal && (
            <>
               <p className="text-sm text-purple-700">Pay to: {proposal.to}</p>
               <p className="text-sm text-purple-700">Pay amount: {proposal.amount}</p>
            </>
         )}
         {}
      </div>
   );
}
