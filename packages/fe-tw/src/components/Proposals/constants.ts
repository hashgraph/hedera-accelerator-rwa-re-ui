import { ProposalState, ProposalType } from "@/types/props";
import { ethers } from "ethers";
import * as Yup from "yup";

export const proposalStates = {
   [ProposalState.ActiveProposal]: "Active",
   [ProposalState.PendingProposal]: "Pending",
   [ProposalState.CanceledProposal]: "Cancelled",
   [ProposalState.DefeatedProposal]: "Defeated",
   [ProposalState.ExecutedProposal]: "Executed",
   [ProposalState.ExpiredProposal]: "Expired",
   [ProposalState.QueuedProposal]: "Queued",
   [ProposalState.SucceededProposal]: "Succeeded",
};

export const proposalTypes = {
   [ProposalType.ChangeReserveProposal]: "Change Reserve Proposal",
   [ProposalType.PaymentProposal]: "Payment Proposal",
   [ProposalType.TextProposal]: "Text Proposal",
   [ProposalType.AddAuditorProposal]: "Add Auditor Proposal",
   [ProposalType.RemoveAuditorProposal]: "Remove Auditor Proposal",
};

export const validationSchema = Yup.object().shape({
   title: Yup.string().required("Title is required"),
   description: Yup.string().required("Description is required"),
   amount: Yup.string().when("type", ([type], schema) => {
      if (type === ProposalType.PaymentProposal || type === ProposalType.ChangeReserveProposal) {
         return schema.required("Amount is required");
      }
      return schema.nullable();
   }),
   type: Yup.string().required("Proposal type is required"),
   to: Yup.string().when("type", ([type], schema) => {
      if (type === ProposalType.PaymentProposal) {
         return schema
            .required("Recipient address is required")
            .test("is-valid-address", "Invalid EVM wallet address", (value) => {
               return value ? ethers.isAddress(value) : false;
            });
      }
      return schema.nullable();
   }),
   auditorWalletAddress: Yup.string().when("type", ([type], schema) => {
      if (type === ProposalType.AddAuditorProposal) {
         return schema
            .required("Auditor wallet address is required")
            .test("is-valid-address", "Invalid EVM wallet address", (value) => {
               return value ? ethers.isAddress(value) : false;
            });
      }
      return schema.nullable();
   }),
});
