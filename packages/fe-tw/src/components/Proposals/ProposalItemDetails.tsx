"use client";

import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { type Proposal, ProposalState, ProposalType } from "@/types/props";
import { proposalStates, proposalTypes } from "./constants";

type Props = {
   proposal: Proposal;
   proposalState: ProposalState;
   proposalDeadline: string;
};

export function ProposalItemDetails({ proposal, proposalState, proposalDeadline }: Props) {
   return (
      <div className="flex flex-col">
         <p className="text-sm text-gray-800 font-bold">
            Proposal type: {(proposalTypes)[proposal.propType as '1']}
         </p>
         {!!proposalState && (
            <p className="text-sm text-gray-800">Proposal state: {proposalStates[proposalState]}</p>
         )}
         {proposalDeadline && (
            <p className="text-sm text-gray-800">
               Proposal deadline:{" "}
               {format(new Date(proposalDeadline), "MM/dd/yyyy 'at' h:mm a", {
                  locale: enGB,
               })}
            </p>
         )}
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
