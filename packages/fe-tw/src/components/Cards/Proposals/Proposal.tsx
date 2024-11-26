import { ProposalType, type ProposalTypes } from "@/types/props";
import { ProposalText } from "@/components/Cards/Proposals/ProposalText";
import { ProposalPayment } from "@/components/Cards/Proposals/ProposalPayment";
import { ProposalRecurringPayment } from "@/components/Cards/Proposals/ProposalRecurringPayment";

function render(proposal: {
	proposal: ProposalTypes;
}) {
	// @ts-ignore
	switch (proposal.propType) {
		case ProposalType.TextProposal:
			// @ts-ignore
			return <ProposalText proposal={proposal} />;
		case ProposalType.PaymentProposal:
			// @ts-ignore
			return <ProposalPayment proposal={proposal} />;
		case ProposalType.RecurringProposal:
			// @ts-ignore
			return <ProposalRecurringPayment proposal={proposal} />;
		default:
			// @ts-ignore
			return <h1>Unknown proposal type {proposal.propType}</h1>;
	}
}

export function Proposal({ proposal }: { proposal: ProposalTypes }) {
	return (
		<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-6">
			<div className="grid grid-cols-6 w-full">
				<div className="col-span-1">#{proposal.id}</div>
				<div className="col-span-3">Title: {proposal.title}</div>
				<div className="col-span-1">Ends: {proposal.expiry.toDateString()}</div>{" "}
				<div className="col-span-1">
					{proposal.votesYes + proposal.votesNo === 0
						? "-None-"
						: "Yes: "
								.concat(
									(
										(proposal.votesYes * 100) /
										(proposal.votesNo + proposal.votesYes)
									).toFixed(2),
								)
								.concat("%")}
				</div>
				<div className="col-span-1">
					<button
						type="button"
						className="bg-green-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
					>
						Yes
					</button>
					&nbsp;
					<button
						type="button"
						className="bg-red-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
					>
						No
					</button>
				</div>
			</div>
			{
				//@ts-ignore
				render(proposal)
			}

			<div className="grid grid-cols-4">
				<div className="col-span-6 text-sm">{proposal.description}</div>
			</div>
		</div>
	);
}
