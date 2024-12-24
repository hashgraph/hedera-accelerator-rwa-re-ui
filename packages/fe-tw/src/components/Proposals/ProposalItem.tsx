"use client";

import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Proposal, ProposalType } from "@/types/props";
import { useState } from "react";
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

  const data = [
    { name: "Yes", votes: votesYes },
    { name: "No", votes: votesNo },
  ];

  return (
    <li
      className="
        border 
        rounded-lg 
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
            <button className="btn btn-md btn-primary" onClick={() => handleVote("yes")}>
              Yes
            </button>
            <button className="btn btn-md btn-secondary" onClick={() => handleVote("no")}>
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

      <div className="text-sm mt-2 flex items-center gap-4">
        <span className="font-semibold text-black">Yes: {votesYes}</span>
        <span className="font-semibold text-black">No: {votesNo}</span>
        {hasVoted && <span className="text-green-600">Thanks for voting!</span>}
      </div>

      <button
        className="btn btn-link btn-sm text-purple-600 mt-2"
        onClick={onToggleExpand}
      >
        {expanded ? "Hide Votes Chart" : "View Votes Chart"}
      </button>

      {/* Expandable section */}
      {expanded && (
        <div className="mt-4">
          <div className="w-full h-32">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#6b46c1" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </li>
  );
}
