import { ProposalState, ProposalType } from "@/types/props";

export const proposalStates = {
    [ProposalState.ActiveProposal]: 'Active',
    [ProposalState.PendingProposal]: 'Pending',
    [ProposalState.CanceledProposal]: 'Cancelled',
    [ProposalState.DefeatedProposal]: 'Defeated',
    [ProposalState.ExecutedProposal]: 'Executed',
    [ProposalState.ExpiredProposal]: 'Expired',
    [ProposalState.QueuedProposal]: 'Queued',
    [ProposalState.SucceededProposal]: 'Succeeded',
};

export const proposalTypes = {
    [ProposalType.ChangeReserveProposal]: 'Change Reserve Proposal',
    [ProposalType.PaymentProposal]: 'Payment Proposal',
    [ProposalType.TextProposal]: 'Text Proposal',
};
