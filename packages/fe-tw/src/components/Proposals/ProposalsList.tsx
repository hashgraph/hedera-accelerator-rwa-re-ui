"use client";

import type {
   Proposal,
   ProposalDeadlines,
   ProposalStates,
   ProposalType,
   ProposalVotes,
} from "@/types/props";
import { useState } from "react";
import { ProposalItem } from "./ProposalItem";

type Props = {
   proposals: Proposal[];
   proposalVotes: ProposalVotes;
   proposalStates: ProposalStates;
   proposalDeadlines: ProposalDeadlines;
   isPastProposals?: boolean;
   isDelegated?: boolean;
   execProposal: (proposalId: number, proposalType: ProposalType) => Promise<string | undefined>;
   voteProposal: (proposalId: number, choice: 0 | 1) => Promise<string | undefined>;
};

export function ProposalsList({
   proposals,
   proposalVotes,
   proposalStates,
   proposalDeadlines,
   voteProposal,
   execProposal,
   isPastProposals = false,
   isDelegated = true,
}: Props) {
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
                     proposalDeadlines={proposalDeadlines}
                     expanded={proposal.id === expandedProposalId}
                     isPastProposal={isPastProposals}
                     isDelegated={isDelegated}
                     {...(!isPastProposals && {
                        onHandleExecProposal: () => {
                           return execProposal(proposal.id, proposal.propType!);
                        },
                        onHandleVote: (yesOrNo) => {
                           return voteProposal(proposal.id, yesOrNo);
                        },
                     })}
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
