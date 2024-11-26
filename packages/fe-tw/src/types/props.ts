type Proposal = {
	id: number;
	title: string;
	description: string;
	started: Date;
	expiry: Date;
	votesYes: number;
	votesNo: number;
	propType: ProposalType;
};

export enum ProposalType {
	TextProposal = "text",
	PaymentProposal = "payment",
	RecurringProposal = "recurring",
}
export type TextProposal = Proposal & {};
export type RecurringPaymentProposal = PaymentProposal & {
	startPayment: Date;
	numPayments: number;
	frequency: number; // in days
};
export type PaymentProposal = Proposal & {
	amount: number;
	to: string;
};
export type ProposalTypes =
	| TextProposal
	| RecurringPaymentProposal
	| PaymentProposal;
