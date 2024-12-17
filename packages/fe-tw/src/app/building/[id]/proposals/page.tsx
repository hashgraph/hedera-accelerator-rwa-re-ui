import { buildings } from "@/consts/buildings";
import { activeProposals } from "@/consts/proposals"; 
import { BuildingData } from "@/types/erc3643/types";
import moment from "moment";

type Props = {
  params: { id: string };
};

export default function ProposalsPage({ params }: Props) {
  const buildingId = parseInt(params.id, 10);
  const buildingData: BuildingData | undefined = buildings.find(b => b.id === buildingId);

  if (!buildingData) {
    return <div>Building not found</div>;
  }

  const now = moment();
  const buildingProposalIds = buildingData.votingItems;
  const proposals = activeProposals.filter(p => buildingProposalIds.includes(p.id));

  const activeProposalsForBuilding = proposals.filter(p =>
    now.isBefore(moment(p.expiry)) && now.isAfter(moment(p.started))
  );

  const recentlyClosedProposals = proposals.filter(p =>
    now.isAfter(moment(p.expiry)) && now.diff(moment(p.expiry), 'days') <= 7
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Proposals for Building {params.id}</h2>

      <h3 className="text-xl font-semibold mb-2">Active Proposals</h3>
      {activeProposalsForBuilding.length === 0 && <p>No active proposals at the moment.</p>}
      <ul className="space-y-4 mb-8">
        {activeProposalsForBuilding.map(proposal => (
          <li key={proposal.id} className="p-4 border rounded-md bg-white">
            <h4 className="text-lg font-semibold">{proposal.title}</h4>
            <p>{proposal.description}</p>
            <p className="text-sm text-gray-500">Starts: {proposal.started.toISOString()}</p>
            <p className="text-sm text-gray-500">Ends: {proposal.expiry.toISOString()}</p>
            <p className="mt-2">
              Votes Yes: {proposal.votesYes}, Votes No: {proposal.votesNo}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Recently Closed Proposals (last 7 days)</h3>
      {recentlyClosedProposals.length === 0 && <p>No proposals have closed recently.</p>}
      <ul className="space-y-4">
        {recentlyClosedProposals.map(proposal => (
          <li key={proposal.id} className="p-4 border rounded-md bg-white">
            <h4 className="text-lg font-semibold">{proposal.title}</h4>
            <p>{proposal.description}</p>
            <p className="text-sm text-gray-500">Ended: {proposal.expiry.toISOString()}</p>
            <p className="mt-2">This proposal has concluded.</p>
          </li>
        ))}
      </ul>
    </div>
  );
}