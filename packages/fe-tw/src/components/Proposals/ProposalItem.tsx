"use client";

import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { differenceInSeconds } from "date-fns";
import { ProposalItemDetails } from "./ProposalItemDetails";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/services/tryCatch";
import {
   ProposalDeadlines,
   ProposalState,
   type Proposal,
   type ProposalStates,
   type ProposalVotes,
} from "@/types/props";

type Props = {
   proposal: Proposal;
   proposalVotes: ProposalVotes;
   proposalStates: ProposalStates;
   proposalDeadlines: ProposalDeadlines;
   expanded: boolean;
   isPastProposal: boolean;
   isDelegated?: boolean;
   onHandleExecProposal?: () => Promise<string | undefined>;
   onHandleVote?: (choice: 0 | 1) => Promise<string | undefined>;
   onToggleExpand: () => void;
};

export function ProposalItem({
   proposal,
   proposalVotes,
   proposalStates,
   proposalDeadlines,
   expanded,
   isPastProposal,
   isDelegated = true,
   onToggleExpand,
   onHandleVote,
   onHandleExecProposal,
}: Props) {
   const totalVotes = proposalVotes[proposal.id]
      ? proposalVotes[proposal.id].no + proposalVotes[proposal.id].yes
      : 0;
   const yesPercent =
      totalVotes === 0 || !proposalVotes[proposal.id]
         ? 0
         : (proposalVotes[proposal.id].yes / totalVotes) * 100;

   const now = new Date();
   const proposalStarted = Number(proposal.started) * 1000;

   const secondsSinceCreation = differenceInSeconds(now, proposalStarted);
   const isVotingDisabledDueToTime = secondsSinceCreation < 60;

   const isVotingDisabled = !isDelegated || isVotingDisabledDueToTime;

   const handleVote = async (desicion: 0 | 1) => {
      if (onHandleVote) {
         const { data, error } = await tryCatch(onHandleVote(desicion));

         if (error) {
            toast.error("User can only vote once");
         } else {
            toast.success(`Vote successfull on proposal, tx id: ${data}`);
         }
      }
   };

   const handleProposalExecution = async () => {
      if (onHandleExecProposal) {
         const { data, error } = await tryCatch(onHandleExecProposal());

         if (error) {
            toast.error(`Execution failed on proposal ${proposal.id}: ${error.message}`);
         } else {
            toast.success(`Execution successfull on proposal ${proposal.id}: ${data}`);
         }
      }
   };

   const getVotingTooltip = () => {
      if (!isDelegated) {
         return "You must delegate your tokens before voting";
      }
      if (isVotingDisabledDueToTime) {
         return "Voting is temporarily disabled - please wait 1 minute after proposal creation";
      }
      return "Vote Yes";
   };

   return (
      <Card>
         {!isPastProposal && (
            <CardHeader>
               <CardTitle className="flex justify-between items-center">
                  {proposal.title && (
                     <h3 className="text-lg font-semibold text-gray-900 mr-4">{proposal.title}</h3>
                  )}
                  <div className="flex gap-2 ml-auto">
                     <Button
                        type="button"
                        size="icon"
                        className={`rounded-full ${isVotingDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleVote(1)}
                        disabled={isVotingDisabled}
                        aria-label="Vote Yes"
                        title={getVotingTooltip()}
                     >
                        <Check />
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${isVotingDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleVote(0)}
                        disabled={isVotingDisabled}
                        aria-label="Vote No"
                        title={
                           !isDelegated
                              ? "You must delegate your tokens before voting"
                              : isVotingDisabledDueToTime
                                ? "Voting is temporarily disabled - please wait 1 minute after proposal creation"
                                : "Vote No"
                        }
                     >
                        <X />
                     </Button>
                  </div>
               </CardTitle>
            </CardHeader>
         )}

         <CardContent>
            <ProposalItemDetails
               proposal={proposal}
               proposalState={proposalStates[proposal.id]}
               proposalDeadline={proposalDeadlines[proposal.id]}
            />
            {!!proposalVotes[proposal.id] && (
               <div className="text-sm mt-4 flex items-center gap-3">
                  <div className="w-50">
                     <span className="font-semibold text-black">
                        Yes: {Math.round(proposalVotes[proposal.id].yes)}
                     </span>
                     <span className="font-semibold text-black ml-4">
                        No: {Math.round(proposalVotes[proposal.id].no)}
                     </span>
                  </div>
                  <Progress value={yesPercent} />
               </div>
            )}
         </CardContent>

         <CardFooter className="flex flex-col gap-4 justify-start items-start mt-auto pb-6">
            <Button
               className="mt-4 w-full"
               type="button"
               variant="outline"
               onClick={onToggleExpand}
            >
               {expanded ? "Hide Details" : "Show Details"}
            </Button>
            {expanded && (
               <div className="mt-4">
                  <p className="text-sm text-gray-800">{proposal.description}</p>
               </div>
            )}
            {proposalStates[proposal.id] === ProposalState.SucceededProposal && (
               <Button
                  type="button"
                  className="rounded-full"
                  onClick={handleProposalExecution}
                  aria-label="Execute Proposal"
               >
                  Execute
               </Button>
            )}
         </CardFooter>
      </Card>
   );
}
