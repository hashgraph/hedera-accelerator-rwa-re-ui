"use client";

import { useState } from "react";
import { Proposal } from "@/types/props";
import { ProposalItem } from "./ProposalItem";

type ProposalsListProps = {
  proposals: Proposal[];
  emptyMessage: string;
  concluded?: boolean;
};

export function ProposalsList({
  proposals,
  emptyMessage,
  concluded = false,
}: ProposalsListProps) {
  const [expandedProposalId, setExpandedProposalId] = useState<number | null>(null);

  return (
    <div>
      {proposals.length === 0 ? (
        <p className="text-gray-500 text-center">{emptyMessage}</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalItem
              key={proposal.id}
              proposal={proposal}
              concluded={concluded}
              expanded={proposal.id === expandedProposalId}
              onToggleExpand={() =>
                setExpandedProposalId(
                  proposal.id === expandedProposalId ? null : proposal.id
                )
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
