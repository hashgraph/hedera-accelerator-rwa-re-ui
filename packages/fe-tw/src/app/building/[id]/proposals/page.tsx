import { buildings } from "@/consts/buildings";
import { activeProposals } from "@/consts/proposals";
import { BuildingData } from "@/types/erc3643/types";
import moment from "moment";
import { ProposalsView } from "@/components/Proposals/ProposalsView";

type Props = {
  params: { id: string };
};

export default function ProposalsPage({ params }: Props) {
  const buildingId = parseInt(params.id, 10);
  const buildingData: BuildingData | undefined = buildings.find(b => b.id === buildingId);

  if (!buildingData) {
    return <div className="p-4">Building not found</div>;
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
    <div className="my-2">
    <h2 className="text-2xl font-bold mb-6">Proposals - Building {buildingId}</h2>
    <ProposalsView
      buildingId={buildingId}
      activeProposals={activeProposalsForBuilding}
      recentlyClosedProposals={recentlyClosedProposals}
    />
    </div>
  );
}
