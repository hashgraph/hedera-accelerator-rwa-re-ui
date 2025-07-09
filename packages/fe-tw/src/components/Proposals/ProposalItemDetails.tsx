"use client";

import { format, differenceInSeconds } from "date-fns";
import { enGB } from "date-fns/locale";
import { type Proposal, ProposalState, ProposalType } from "@/types/props";
import { proposalStates, proposalTypes } from "./constants";

type Props = {
   proposal: Proposal;
   proposalState: ProposalState;
   proposalDeadline: string;
};

export function ProposalItemDetails({ proposal, proposalState, proposalDeadline }: Props) {
   const now = new Date();
   const proposalStarted = Number(proposal.started) * 1000;

   const secondsSinceCreation = differenceInSeconds(now, proposalStarted);
   const isVotingDisabled = secondsSinceCreation < 60;
   const timeUntilVotingEnabled = Math.max(0, 60 - secondsSinceCreation);

   return (
      <div className="flex flex-col">
         <p className="text-sm text-gray-800 font-bold">
            Proposal type: {proposalTypes[proposal.propType as "1"]}
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

         {/* Voting restriction notice */}
         {isVotingDisabled && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
               <p className="text-sm text-yellow-800 font-medium">
                  ⏱️ Voting is currently disabled
               </p>
               <p className="text-sm text-yellow-700">
                  You can vote in {timeUntilVotingEnabled} seconds. This restriction helps prevent
                  rapid voting on newly created proposals.
               </p>
            </div>
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
