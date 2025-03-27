"use client";

import type { VoteType } from "@/types/common";
import type { Proposal } from "@/types/props";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import moment from "moment";
import { useState } from "react";
import { ProposalDetails } from "./ProposalDetails";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

type ProposalItemProps = {
   proposal: Proposal;
   concluded: boolean;
   expanded: boolean;
   onToggleExpand: () => void;
};

export function ProposalItem({ proposal, concluded, expanded, onToggleExpand }: ProposalItemProps) {
   const [votesYes, setVotesYes] = useState(proposal.votesYes);
   const [votesNo, setVotesNo] = useState(proposal.votesNo);
   const [hasVoted, setHasVoted] = useState(false);

   const handleVote = (type: VoteType) => {
      if (hasVoted) return;
      if (type === "yes") {
         setVotesYes((prev) => prev + 1);
      } else {
         setVotesNo((prev) => prev + 1);
      }
      setHasVoted(true);
   };

   const totalVotes = votesYes + votesNo;
   const yesPercent = totalVotes === 0 ? 0 : (votesYes / totalVotes) * 100;
   const noPercent = 100 - yesPercent;

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex justify-between">
               <h3 className="text-lg font-bold">{proposal.title}</h3>
               {!concluded && !hasVoted && (
                  <div className="flex gap-2">
                     <Button
                        type="button"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleVote("yes")}
                        aria-label="Vote Yes"
                     >
                        <CheckIcon fontSize="small" />
                     </Button>

                     <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleVote("no")}
                        aria-label="Vote No"
                     >
                        <CloseIcon fontSize="small" />
                     </Button>
                  </div>
               )}
            </CardTitle>

            <CardDescription>{proposal.description}</CardDescription>
         </CardHeader>

         <CardContent>
            <ProposalDetails proposal={proposal} />

            <p className="text-xs text-gray-500">
               {concluded
                  ? `Ended: ${moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}`
                  : `Ends: ${moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}`}
            </p>

            <div className="text-sm mt-4 flex items-center gap-3">
               <span className="font-semibold text-black">Yes: {votesYes}</span>
               <span className="font-semibold text-black">No: {votesNo}</span>
               {hasVoted && (
                  <span className="text-green-600 whitespace-nowrap">Thanks for voting!</span>
               )}

               <Progress value={yesPercent} />
            </div>
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
                  <p className="text-sm text-gray-700">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultrices, libero
                     a porta pulvinar, ipsum velit dapibus nibh, eget dictum turpis sem quis risus.
                     Praesent sed lacus a velit.
                  </p>
               </div>
            )}
         </CardFooter>
      </Card>
   );
}
