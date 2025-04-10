"use client";

import { toast } from "sonner";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { ProposalDetails } from "./ProposalDetails";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label"
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/services/tryCatch";
import { ProposalState, type Proposal, type ProposalStates, type ProposalVotes } from "@/types/props";

type Props = {
   proposal: Proposal;
   proposalVotes: ProposalVotes;
   proposalStates: ProposalStates;
   expanded: boolean;
   onExecProposal?: () => void;
   onToggleExpand: () => void;
   onHandleVote: (proposalId: number, choice: 0 | 1) => Promise<string | undefined>;
};

export function ProposalItem({ proposal, proposalVotes, proposalStates, expanded, onToggleExpand, onHandleVote }: Props) {
   const totalVotes = proposalVotes[proposal.id] ? proposalVotes[proposal.id].no + proposalVotes[proposal.id].yes : 0;
   const yesPercent = (totalVotes === 0 || !proposalVotes[proposal.id]) ? 0 : (proposalVotes[proposal.id].yes / totalVotes) * 100;

   const handleVote = async (desicion: 0 | 1) => {
      const { data, error } = await tryCatch(onHandleVote(proposal.id, desicion));

      if (error) {
         toast.error(`Vote error on proposal ${proposal.id}: ${error.message}`);
      } else {
         toast.success(`Vote successfull on proposal: ${data}`);
      }
   };

   const state = proposalStates[proposal.id];

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex justify-between">
               {state === ProposalState.ExpiredProposal && (
                  <Label style={{
                     color: '#fff',
                     backgroundColor: '#000',
                     fontSize: 13,
                  }} className="p-2">Proposal is expired</Label>
               )}
               {state === ProposalState.SucceededProposal && (
                  <Label style={{
                     color: '#fff',
                     backgroundColor: '#000',
                     fontSize: 13,
                  }} className="p-2">Proposal is concluded</Label>
               )}
               {(state === ProposalState.ActiveProposal || state === ProposalState.PendingProposal) && (
                  <div className="flex gap-2">
                     <Button
                        type="button"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleVote(1)}
                        aria-label="Vote Yes"
                     >
                        <CheckIcon fontSize="small" />
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleVote(0)}
                        aria-label="Vote No"
                     >
                        <CloseIcon fontSize="small" />
                     </Button>
                  </div>
               )}
            </CardTitle>

            <p className="mt-4 text-md text-gray-800 font-bold">
               {proposal.description}
            </p>
         </CardHeader>

         <CardContent>
            <ProposalDetails proposal={proposal} />

            {!!proposalVotes[proposal.id] && <div className="text-sm mt-4 flex items-center gap-3">
               <div className="w-50">
                  <span className="font-semibold text-black">Yes: {proposalVotes[proposal.id].yes}</span>
                  <span className="font-semibold text-black ml-4">No: {proposalVotes[proposal.id].no}</span>
               </div>

               <Progress value={yesPercent} />
            </div>}
         </CardContent>
         <CardFooter className="flex flex-col mt-auto">
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
         </CardFooter>
      </Card>
   );
}
