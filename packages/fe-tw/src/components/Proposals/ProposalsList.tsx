"use client";

import type { Proposal, ProposalStates, ProposalType, ProposalVotes } from "@/types/props";
import { useState } from "react";
import { ProposalItem } from "./ProposalItem";

type Props = {
   proposals: Proposal[];
   proposalVotes: ProposalVotes;
   proposalStates: ProposalStates;
   execProposal: (proposalId: number, proposalType: ProposalType) => Promise<string | undefined>;
   voteProposal: (proposalId: number, choice: 0 | 1) => Promise<string | undefined>;
};

export function ProposalsList({ proposals, proposalVotes, proposalStates, voteProposal, execProposal }: Props) {
   const [expandedProposalId, setExpandedProposalId] = useState<number | null>(null);

   return (
      <div>
         {!proposals.length ? (
            <p className="text-gray-500 text-center">No proposals submitted</p>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {proposals.map((proposal) => (
                  <ProposalItem
                     key={proposal.id}
                     proposal={proposal}
                     proposalVotes={proposalVotes}
                     proposalStates={proposalStates}
                     expanded={proposal.id === expandedProposalId}
                     onHandleExecProposal={() => {
                        return execProposal(proposal.id, proposal.propType!);
                     }}
                     onToggleExpand={() =>
                        setExpandedProposalId(
                           proposal.id === expandedProposalId ? null : proposal.id,
                        )
                     }
                     onHandleVote={(id, direction) => voteProposal(id, direction)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
