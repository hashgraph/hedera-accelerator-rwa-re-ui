"use client";

import { Proposal } from "@/types/props";
import { ProposalsList } from "./ProposalsList";

type ProposalsViewProps = {
  buildingId: number;
  activeProposals: Proposal[];
  recentlyClosedProposals: Proposal[];
};

export function ProposalsView({ buildingId, activeProposals, recentlyClosedProposals }: ProposalsViewProps) {
  return (
    <div>
      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <ProposalsList
        title="Active Proposals"
        proposals={activeProposals}
        emptyMessage="No active proposals at the moment."
        className="mt-6"
      />
      <ProposalsList
        title="Recently Closed Proposals (last 7 days)"
        proposals={recentlyClosedProposals}
        emptyMessage="No proposals have closed recently."
        concluded={true}
      />
    </div>
    </div>
  );
}