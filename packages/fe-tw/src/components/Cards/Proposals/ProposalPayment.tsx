import type { PaymentProposal } from "@/types/props";
import React from "react";

export function ProposalPayment({ proposal }: ProposalPaymentPropTypes) {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-4">
				<h3 className="font-semibold text-base text-slate-700 text-left">
					Pay ${proposal.amount} to {proposal.to} as a single payment
				</h3>
			</div>
		</div>
	);
}

interface ProposalPaymentPropTypes {
	proposal: PaymentProposal;
}
