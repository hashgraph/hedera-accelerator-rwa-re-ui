type ProposalCommon = {
   id: number;
   description: string;
   started: Date | number;
   expiry: Date | number;
};

export type Proposal =
   {
      amount?: number,
      to?: `0x${string}`,
      propType?: ProposalType.PaymentProposal,
   } & ProposalCommon | {
      propType: ProposalType.TextProposal;
   } & ProposalCommon | {
      propType: ProposalType.ChangeReserveProposal
   } & ProposalCommon;

export type ProposalVotes = {
   [key: string]: {
      yes: number,
      no: number,
   }
};

export enum ProposalType {
   TextProposal = "text",
   PaymentProposal = "payment",
   ChangeReserveProposal = "changeReserve",
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
export type ProposalTypes = TextProposal | RecurringPaymentProposal | PaymentProposal;
