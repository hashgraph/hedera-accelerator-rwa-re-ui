"use client";

import moment from "moment";
import { useState } from "react";
import { Proposal, ProposalType } from "@/types/props";
import { ProposalDetails } from "./ProposalDetails";

type ProposalItemProps = {
  proposal: Proposal;
  concluded: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
};

export function ProposalItem({
  proposal,
  concluded,
  expanded,
  onToggleExpand,
}: ProposalItemProps) {
  const [votesYes, setVotesYes] = useState(proposal.votesYes);
  const [votesNo, setVotesNo] = useState(proposal.votesNo);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (type: "yes" | "no") => {
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
  const noPercent = 100 - yesPercent; // Remaining portion goes to "No"

  return (
    <li
      className="
        border 
        rounded-xl   /* rounder corners */
        p-4 
        bg-white 
        shadow-sm 
        transition-colors 
        duration-150 
        ease-in-out 
        hover:shadow-md 
        hover:bg-gray-50
      "
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{proposal.title}</h3>
        {!concluded && !hasVoted && (
          <div className="flex gap-2">
            <button
              className="btn btn-md btn-primary"
              onClick={() => handleVote("yes")}
            >
              Yes
            </button>
            <button
              className="btn btn-md btn-secondary"
              onClick={() => handleVote("no")}
            >
              No
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
          <span className="text-green-600 whitespace-nowrap">
            Thanks for voting!
          </span>
        )}

        <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-300"
            style={{ width: `${yesPercent}%` }}
          />
          <div
            className="absolute top-0 right-0 h-full bg-red-300"
            style={{ width: `${noPercent}%` }}
          />
        </div>
      </div>

      <button
        className="btn btn-link btn-sm text-purple-600 mt-2"
        onClick={onToggleExpand}
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            ultrices, libero a porta pulvinar, ipsum velit dapibus nibh, eget
            dictum turpis sem quis risus. Praesent sed lacus a velit.
          </p>
        </div>
      )}
    </li>
  );
}
