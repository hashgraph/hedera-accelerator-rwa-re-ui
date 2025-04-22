"use client";

import { toast } from "sonner";
import { ProposalItemDetails } from "./ProposalItemDetails";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/services/tryCatch";
import { ProposalState, type Proposal, type ProposalStates, type ProposalVotes } from "@/types/props";
import { Check, X } from "lucide-react";

type Props = {
   proposal: Proposal;
   proposalVotes: ProposalVotes;
   proposalStates: ProposalStates;
   expanded: boolean;
   isPastProposal: boolean;
   onHandleExecProposal?: () => Promise<string | undefined>;
   onHandleVote?: (choice: 0 | 1) => Promise<string | undefined>;
   onToggleExpand: () => void;
};

export function ProposalItem({ proposal, proposalVotes, proposalStates, expanded, isPastProposal, onToggleExpand, onHandleVote, onHandleExecProposal }: Props) {
   const totalVotes = proposalVotes[proposal.id] ? proposalVotes[proposal.id].no + proposalVotes[proposal.id].yes : 0;
   const yesPercent = (totalVotes === 0 || !proposalVotes[proposal.id]) ? 0 : (proposalVotes[proposal.id].yes / totalVotes) * 100;

   const handleVote = async (desicion: 0 | 1) => {
      if (onHandleVote) {
         const { data, error } = await tryCatch(onHandleVote(desicion));

         if (error) {
            toast.error(`Vote error on proposal ${proposal.id}: ${error.message}`);
         } else {
            toast.success(`Vote successfull on proposal: ${data}`);
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

   return (
      <Card>

         {!isPastProposal && <CardHeader>
            <CardTitle className="flex justify-between">
               <div className="flex gap-2">
                  <Button
                     type="button"
                     size="icon"
                     className="rounded-full"
                     onClick={() => handleVote(1)}
                     aria-label="Vote Yes"
                  >
                     {/** */}
                  </Button>
                  <Button
                     type="button"
                     variant="outline"
                     size="icon"
                     className="rounded-full"
                     onClick={() => handleVote(0)}
                     aria-label="Vote No"
                  >
                     {/** */}
                  </Button>
               </div>
            </CardTitle>
         </CardHeader>}

         <CardContent>
            <ProposalItemDetails proposal={proposal} proposalState={proposalStates[proposal.id]}  />
            {!!proposalVotes[proposal.id] && <div className="text-sm mt-4 flex items-center gap-3">
               <div className="w-50">
                  <span className="font-semibold text-black">Yes: {proposalVotes[proposal.id].yes}</span>
                  <span className="font-semibold text-black ml-4">No: {proposalVotes[proposal.id].no}</span>
               </div>
               <Progress value={yesPercent} />
            </div>}
         </CardContent>

         <CardFooter className="flex flex-col gap-4 justify-start items-start mt-auto">
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
                  <p className="text-sm text-gray-800">
                     {proposal.description}
                  </p>
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
