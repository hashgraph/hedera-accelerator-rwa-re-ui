import type { RecurringPaymentProposal } from "@/types/props";
import React from "react";

export function ProposalRecurringPayment({
	proposal,
}: ProposalRecurringPaymentPropTypes) {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-4">
				<h3 className="font-semibold text-base text-slate-700 text-left">
					Pay ${proposal.amount} to {proposal.to} as {proposal.frequency}{" "}
					reoccurring payments. Starting on{" "}
					{proposal.startPayment.toDateString()} every {proposal.frequency}
				</h3>
			</div>
		</div>
	);
}

interface ProposalRecurringPaymentPropTypes {
	proposal: RecurringPaymentProposal;
}
