import type {
	BuildingSliceCategoryData,
	BuildingSliceData,
} from "@/types/erc3643/types";
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
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti. In in et amet phasellus orci tristique dolor purus taciti. Egestas orci bibendum nulla ligula sit ipsum erat. Non euismod molestie inceptos proin enim. Ornare neque fermentum mi erat ligula eu.",
		started: new Date(),
		expiry: new Date(),
		votesYes: 10,
		votesNo: 20,
		propType: ProposalType.TextProposal,
	},
	{
		id: 2,
		title: "Payment Prop",
		description:
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti. In in et amet phasellus orci tristique dolor purus taciti. Egestas orci bibendum nulla ligula sit ipsum erat. Non euismod molestie inceptos proin enim. Ornare neque fermentum mi erat ligula eu.",
		started: new Date(),
		expiry: new Date(),
		votesYes: 10,
		votesNo: 20,
		amount: 200,
		to: "john",
		propType: ProposalType.PaymentProposal,
	},
	{
		id: 3,
		title: "Recurring Prop",
		description:
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti. In in et amet phasellus orci tristique dolor purus taciti. Egestas orci bibendum nulla ligula sit ipsum erat. Non euismod molestie inceptos proin enim. Ornare neque fermentum mi erat ligula eu.",
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
	},
	{
		id: 5,
		title: "Test Prop",
		description:
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti. In in et amet phasellus orci tristique dolor purus taciti. Egestas orci bibendum nulla ligula sit ipsum erat. Non euismod molestie inceptos proin enim. Ornare neque fermentum mi erat ligula eu.",
		started: new Date(),
		expiry: new Date(),
		votesYes: 10,
		votesNo: 20,
		propType: ProposalType.TextProposal,
	},
];

export const buildingSlices: BuildingSliceData[] = [
	{
		imageSource: "/assets/dome.jpeg",
		name: "Chicago Highs",
		estimatedPrice: 50,
		timeToEnd: 1000000,
		allocation: 20,
	},
	{
		imageSource: "/assets/dome.jpeg",
		name: "Moher Hills",
		estimatedPrice: 20,
		timeToEnd: 1000000,
		allocation: 10,
	},
];

export const buildingSliceCategories: BuildingSliceCategoryData[] = [
	{
		title: "Featured Development started in Chicago Highs",
		name: "chicago",
		items: buildingSlices,
		itemsSize: "lg",
	},
	{
		title: "Featured Development started in Hollywood",
		name: "hollywood",
		items: buildingSlices,
		itemsSize: "extra-lg",
	},
];
