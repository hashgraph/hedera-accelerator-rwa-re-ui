"use client";

import type { Proposal } from "@/types/props";
import { useState } from "react";
import { ProposalItem } from "./ProposalItem";

type ProposalsListProps = {
   proposals: Proposal[];
   emptyMessage: string;
   concluded?: boolean;
};

export function ProposalsList({ proposals, emptyMessage, concluded = false }: ProposalsListProps) {
   const [expandedProposalId, setExpandedProposalId] = useState<number | null>(null);

   return (
      <div>
         {proposals.length === 0 ? (
            <p className="text-gray-500 text-center">{emptyMessage}</p>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {proposals.map((proposal) => (
                  <ProposalItem
                     key={proposal.id}
                     proposal={proposal}
                     concluded={concluded}
                     expanded={proposal.id === expandedProposalId}
                     onToggleExpand={() =>
                        setExpandedProposalId(
                           proposal.id === expandedProposalId ? null : proposal.id,
                        )
                     }
                  />
               ))}
            </div>
         )}
      </div>
   );
}
