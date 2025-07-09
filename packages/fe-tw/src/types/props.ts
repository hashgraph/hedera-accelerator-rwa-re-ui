type ProposalCommon = {
   id: number;
   title?: string;
   description: string;
   started: Date | number;
   expiry: Date | number;
   votesYes: number;
   votesNo: number;
};

export type Proposal =
   | ({
        amount?: number;
        to?: `0x${string}`;
        propType?: ProposalType.PaymentProposal;
     } & ProposalCommon)
   | ({
        propType: ProposalType.TextProposal;
     } & ProposalCommon)
   | ({
        amount?: number;
        propType: ProposalType.ChangeReserveProposal;
     } & ProposalCommon);

export type ProposalVotes = {
   [key: string]: {
      yes: number;
      no: number;
   };
};

export type ProposalStates = {
   [key: string]: ProposalState;
};

export type ProposalDeadlines = {
   [key: string]: string;
};

export enum ProposalState {
   PendingProposal = "0",
   ActiveProposal = "1",
   CanceledProposal = "2",
   DefeatedProposal = "3",
   SucceededProposal = "4",
   QueuedProposal = "5",
   ExpiredProposal = "6",
   ExecutedProposal = "7",
}

export enum ProposalType {
   TextProposal = "0",
   PaymentProposal = "1",
   ChangeReserveProposal = "2",
   AddAuditorProposal = "3",
   RemoveAuditorProposal = "4",
}

export type TextProposal = Proposal & {};
export type PaymentProposal = Proposal & {
   amount: number;
   to: string;
};
export type RecurringPaymentProposal = PaymentProposal & {
   startPayment: Date;
   numPayments: number;
   frequency: number; // in days
};
export type ProposalTypes = TextProposal | RecurringPaymentProposal | PaymentProposal;
