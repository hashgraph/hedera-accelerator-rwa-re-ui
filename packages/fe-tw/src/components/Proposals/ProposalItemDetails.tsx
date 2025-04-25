"use client";

import { type Proposal, ProposalState, ProposalType } from "@/types/props";
import { proposalStates, proposalTypes } from "./constants";

type Props = {
   proposal: Proposal;
   proposalState: ProposalState;
   proposalDeadline: string;
};

const formatProposalTime = (value: string, locale = 'en-GB') => {
   const opts: Intl.DateTimeFormatOptions = {
      year:   'numeric',
      month:  '2-digit',
      day:    '2-digit',
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
   };
   
   return new Intl.DateTimeFormat(locale, opts).format(new Date(value));
};

export function ProposalItemDetails({ proposal, proposalState, proposalDeadline }: Props) {
   return (
      <div className="flex flex-col">
         <p className="text-sm text-gray-800 font-bold">
            Proposal type: {proposalTypes[proposal.propType as ProposalType]}
         </p>
         {!!proposalState && <p className="text-sm text-gray-800">
            Proposal state: {proposalStates[proposalState]}
         </p>}
         <p className="text-sm text-gray-800">
            Proposal deadline: {formatProposalTime(proposalDeadline)}
         </p>
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
