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
      expiry: new Date(),
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
      started: new Date(),
      expiry: new Date(),
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
      expiry: new Date(),
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
      started: new Date(),
      expiry: new Date(),
      votesYes: 10,
      votesNo: 20,
      propType: ProposalType.TextProposal,
      imageUrl: "/assets/dome.jpeg",
    },
  ];
  