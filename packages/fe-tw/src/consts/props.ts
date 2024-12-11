import type {
	BuildingData,
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
			imageUrl: '/assets/dome.jpeg',
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
			imageUrl: '/assets/dome.jpeg',
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
			imageUrl: '/assets/dome.jpeg',
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
			imageUrl: '/assets/dome.jpeg',
		},
	];

export const buildings: BuildingData[] = [{
	id: 1234,
	title: 'River City Apartments - Chicago',
	purchasedAt: 1733398424098,
	description: 'Lorem ispum dolor dolor dolor \\ Lorem ispum dolor dolor dolor',
	info: {
		financial: {
			percentageOwned: 50,
			tokenPrice: 8,
			directExposure: 1600,
			yield: [{ percentage: 10, days: 50 }, { percentage: 30, days: 100 }],
			treasury: 6000,
		},
		demographics: {
			constructedYear: 2005,
			type: 'Hi-Rise',
			location: '60678 (US / Chicago)',
			locationType: 'Urban',
		},
	},
	votingItems: [1],
	partOfSlices: [1234, 5678],
}, {
	id: 5678,
	title: 'Green City Apartments - New York',
	purchasedAt: 1733398424098,
	description: 'Lorem ispum dolor dolor dolor \\ Lorem ispum dolor dolor dolor',
	info: {
		financial: {
			percentageOwned: 100,
			tokenPrice: 10,
			directExposure: 1500,
			yield: [{ percentage: 10, days: 50 }, { percentage: 30, days: 100 }],
			treasury: 5000,
		},
		demographics: {
			constructedYear: 1998,
			type: 'Hi-Rise',
			location: '60678 (US / Chicago)',
			locationType: 'Urban',
		},
	},
	votingItems: [1],
	partOfSlices: [1, 2],
}]

export const buildingSlices: BuildingSliceData[] = [
	{
		imageUrl: "/assets/dome.jpeg",
		name: "Chicago Highs",
		estimatedPrice: 50,
		endsAt: 1733398424098,
		allocation: 20,
		id: 1,
		description: 'Lorem ispum dolor',
	},
	{
		imageUrl: "/assets/dome.jpeg",
		name: "Moher Hills",
		estimatedPrice: 20,
		endsAt: 1733398424098,
		allocation: 10,
		id: 2,
		description: 'Lorem ispum dolor',
	},
];

export const buildingSliceCategories: BuildingSliceCategoryData[] = [
	{
		id: 1,
		title: "Featured Development started in Chicago Highs",
		name: "chicago",
		items: buildingSlices,
		itemsSize: "lg",
	},
	{
		id: 2,
		title: "Featured Development started in Hollywood",
		name: "hollywood",
		items: buildingSlices,
		itemsSize: "extra-lg",
	},
];

