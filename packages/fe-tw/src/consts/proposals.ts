import {
  type PaymentProposal,
  ProposalType,
  type RecurringPaymentProposal,
  type TextProposal,
} from "@/types/props";

export const activeProposals: (
  | TextProposal
  | PaymentProposal
  | RecurringPaymentProposal
)[] = [
  {
    id: 1,
    title: "Test Prop",
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
    started: new Date(),
    expiry: new Date(Date.now() + 3 * 24 * 3600 * 1000), // expires in 3 days
    votesYes: 10,
    votesNo: 20,
    propType: ProposalType.TextProposal,
    imageUrl: "/assets/dome.jpeg",
  },
  {
    id: 2,
    title: "Payment Prop",
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
    started: new Date(Date.now() - 24 * 3600 * 1000), // started 1 day ago
    expiry: new Date(Date.now() + 2 * 24 * 3600 * 1000), // expires in 2 days
    votesYes: 10,
    votesNo: 20,
    amount: 200,
    to: "john",
    propType: ProposalType.PaymentProposal,
    imageUrl: "/assets/dome.jpeg",
  },
  {
    id: 3,
    title: "Recurring Prop",
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
    started: new Date(),
    expiry: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    votesYes: 10,
    votesNo: 20,
    amount: 200,
    to: "john",
    frequency: 7,
    numPayments: 5,
    startPayment: new Date(),
    propType: ProposalType.RecurringProposal,
    imageUrl: "/assets/dome.jpeg",
  },
  {
    id: 5,
    title: "Test Prop",
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
    started: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    expiry: new Date(Date.now() + 1 * 24 * 3600 * 1000),
    votesYes: 10,
    votesNo: 20,
    propType: ProposalType.TextProposal,
    imageUrl: "/assets/dome.jpeg",
  },
  {
    id: 6,
    title: "Increase Security Budget",
    description:
      "Proposal to allocate additional funds for security staff and equipment.",
    started: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    expiry: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    votesYes: 15,
    votesNo: 4,
    propType: ProposalType.TextProposal,
    imageUrl: "/assets/security.jpeg",
  },
  {
    id: 7,
    title: "Fund Landscape Maintenance",
    description:
      "Hire professional landscapers for the building courtyard.",
    started: new Date(Date.now() - 24 * 3600 * 1000),
    expiry: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    votesYes: 8,
    votesNo: 2,
    amount: 500,
    to: "GreenLandscapes Inc.",
    propType: ProposalType.PaymentProposal,
    imageUrl: "/assets/landscape.jpeg",
  },
  {
    id: 8,
    title: "Monthly Elevator Maintenance",
    description:
      "Recurring monthly payment to elevator maintenance company.",
    started: new Date(),
    expiry: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    votesYes: 20,
    votesNo: 1,
    amount: 1000,
    to: "ElevatorCo",
    frequency: 30, // every 30 days
    numPayments: 12,
    startPayment: new Date(),
    propType: ProposalType.RecurringProposal,
    imageUrl: "/assets/elevator.jpeg",
  },
  {
    id: 9,
    title: "Community BBQ Event",
    description:
      "Proposal to hold a community BBQ event next month.",
    started: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    expiry: new Date(Date.now() + 2 * 24 * 3600 * 1000),
    votesYes: 30,
    votesNo: 5,
    propType: ProposalType.TextProposal,
    imageUrl: "/assets/bbq.jpeg",
  },
  {
    id: 10,
    title: "Upgrade Gym Equipment",
    description:
      "Pay for new gym equipment and facilities.",
    started: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    expiry: new Date(Date.now() - 1 * 24 * 3600 * 1000), // expired
    votesYes: 25,
    votesNo: 10,
    amount: 3000,
    to: "FitCorp",
    propType: ProposalType.PaymentProposal,
    imageUrl: "/assets/gym.jpeg",
  },
];
