import {
   type PaymentProposal,
   ProposalType,
   type RecurringPaymentProposal,
   type TextProposal,
} from "@/types/props";

export const activeProposals: (TextProposal | PaymentProposal | RecurringPaymentProposal)[] = [
   {
      id: 1,
      title: "Approve Annual Budget",
      description:
         "Proposal to approve the annual budget allocation for building maintenance, security, and other expenses.",
      started: new Date(),
      expiry: new Date(Date.now() + 3 * 24 * 3600 * 1000), // expires in 3 days
      votesYes: 25,
      votesNo: 5,
      propType: ProposalType.TextProposal,
      imageUrl: "/assets/budget.jpeg",
   },
   {
      id: 2,
      title: "Upgrade Building Lighting",
      description:
         "Proposal to replace outdated building lights with energy-efficient LED lighting. This will reduce electricity costs and enhance visibility.",
      started: new Date(Date.now() - 24 * 3600 * 1000), // started 1 day ago
      expiry: new Date(Date.now() + 2 * 24 * 3600 * 1000), // expires in 2 days
      votesYes: 30,
      votesNo: 10,
      amount: 5000,
      to: "BrightLights Co.",
      propType: ProposalType.PaymentProposal,
      imageUrl: "/assets/lighting.jpeg",
   },
   {
      id: 3,
      title: "Weekly Cleaning Service",
      description:
         "Proposal to introduce a recurring weekly cleaning service for the building's common areas to maintain hygiene and cleanliness.",
      started: new Date(),
      expiry: new Date(Date.now() + 10 * 24 * 3600 * 1000), // expires in 10 days
      votesYes: 15,
      votesNo: 3,
      amount: 800,
      to: "CleanSpaces Inc.",
      frequency: 7,
      numPayments: 52,
      startPayment: new Date(),
      propType: ProposalType.RecurringProposal,
      imageUrl: "/assets/cleaning.jpeg",
   },
   {
      id: 4,
      title: "Host a Community Workshop",
      description:
         "Proposal to organize a community workshop focused on energy conservation and sustainable practices for residents.",
      started: new Date(Date.now() - 24 * 3600 * 1000),
      expiry: new Date(Date.now() + 6 * 24 * 3600 * 1000), // expires in 6 days
      votesYes: 18,
      votesNo: 2,
      propType: ProposalType.TextProposal,
      imageUrl: "/assets/workshop.jpeg",
   },
   {
      id: 5,
      title: "Replace Lobby Furniture",
      description:
         "Proposal to replace the current worn-out lobby furniture with modern, durable, and aesthetically pleasing options.",
      started: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      expiry: new Date(Date.now() + 4 * 24 * 3600 * 1000),
      votesYes: 20,
      votesNo: 6,
      amount: 3000,
      to: "ModernLiving Interiors",
      propType: ProposalType.PaymentProposal,
      imageUrl: "/assets/furniture.jpeg",
   },
];
