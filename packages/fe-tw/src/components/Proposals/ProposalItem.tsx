"use client";

import type { VoteType } from "@/types/common";
import type { Proposal } from "@/types/props";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import moment from "moment";
import { useState } from "react";
import { ProposalDetails } from "./ProposalDetails";

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
      <li
         className="
        border 
        rounded-xl 
        p-4 
        bg-white 
        transition-colors 
        duration-150 
        ease-in-out 
        hover:bg-gray-50
      "
      >
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{proposal.title}</h3>
            {!concluded && !hasVoted && (
               <div className="flex gap-2">
                  <button
                     type="button"
                     className="w-10 h-10 border-2 border-purple-500 text-purple-500 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                     onClick={() => handleVote("yes")}
                     aria-label="Vote Yes"
                  >
                     <CheckIcon fontSize="small" />
                  </button>

                  <button
                     type="button"
                     className="w-10 h-10 bg-gray-200 text-white flex items-center justify-center rounded-full hover:bg-gray-300 transition"
                     onClick={() => handleVote("no")}
                     aria-label="Vote No"
                  >
                     <CloseIcon fontSize="small" />
                  </button>
               </div>
            )}
         </div>

         <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
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

            <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
               <div
                  className="absolute top-0 left-0 h-full bg-green-300"
                  style={{ width: `${yesPercent}%` }}
               />
               <div
                  className="absolute top-0 right-0 h-full bg-gray-200"
                  style={{ width: `${noPercent}%` }}
               />
            </div>
         </div>

         <button
            type="button"
            className="btn btn-link btn-sm text-purple-600 mt-2"
            onClick={onToggleExpand}
         >
            {expanded ? "Hide Details" : "Show Details"}
         </button>

         {expanded && (
            <div className="mt-4">
               <p className="text-sm text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultrices, libero a
                  porta pulvinar, ipsum velit dapibus nibh, eget dictum turpis sem quis risus.
                  Praesent sed lacus a velit.
               </p>
            </div>
         )}
      </li>
   );
}
