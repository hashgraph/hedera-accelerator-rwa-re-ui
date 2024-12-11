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
	partOfSlices: [1234, 5678],
}]

export const buildingSlices: BuildingSliceData[] = [
	{
		imageUrl: "/assets/dome.jpeg",
		name: "Chicago Highs",
		estimatedPrice: 50,
		timeToEnd: 1000000,
		allocation: 20,
		description: "Chicago Highs is a premier development located in the heart of Chicago, offering state-of-the-art facilities and modern living spaces.",
		id: 1
	},
	{
		imageUrl: "/assets/dome.jpeg",
		name: "Moher Hills",
		estimatedPrice: 20,
		timeToEnd: 1000000,
		allocation: 10,
		description: "Moher Hills provides serene environments with lush greenery and beautifully designed homes, perfect for families and professionals alike.",
		id: 2
	},
];

export const buildingSliceCategories: BuildingSliceCategoryData[] = [{
	id: 1,
	title: 'Featured Development started in Chicago Highs',
    name: 'chicago',
    items: buildingSlices,
	itemsSize: 'lg',
}, {
	id: 2,
	title: "Featured Development started in Hollywood",
	name: "hollywood",
	items: buildingSlices,
	itemsSize: 'lg',
}
]
  
export const mockSliceTokens = [
	{
	  tokenAddress: "0xTokenA",
	  idealAllocation: "33%",
	  actualAllocation: "40%",
	},
	{
	  tokenAddress: "0xTokenB",
	  idealAllocation: "33%",
	  actualAllocation: "35%",
	  },
	{
	  tokenAddress: "0xTokenC",
	  idealAllocation: "34%",
	  actualAllocation: "25%",
	},
  ];

export const mockTokenToBuildingMap = {
	"0xTokenA": {
	  nftId: 123,
	  name: "Building A",
	  image: "https://plum-famous-crane-874.mypinata.cloud/ipfs/bafybeig2zpuq4nz4l4iiq6dnpx5rgxn5wmkwvyqi466u3lep6cvpc56pmu?pinataGatewayToken=k5WJ6L2sEo6eMgjWXh4IlXiOGh-nNFBl-FqHTFnm6wt1cpPkgtpB0PfDVv0Lu9kF",
	  location: "4th Street",
	},
	"0xTokenB": {
	  nftId: 456,
	  name: "Building B",
	  image: "https://plum-famous-crane-874.mypinata.cloud/ipfs/bafybeia5n2baxxz4vh6a3jyahhatxt4n3q2czib6f3xqgznvjqm234fkpa?pinataGatewayToken=k5WJ6L2sEo6eMgjWXh4IlXiOGh-nNFBl-FqHTFnm6wt1cpPkgtpB0PfDVv0Lu9kF",
	  location: "7th Street",
	},
	"0xTokenC": {
	  nftId: 789,
	  name: "Building C",
	  image: "https://plum-famous-crane-874.mypinata.cloud/ipfs/bafybeiavg4xnaq7k6cd4nkxjnrz7yplw7h3zhj6av4iy3rikjua7le75de?pinataGatewayToken=k5WJ6L2sEo6eMgjWXh4IlXiOGh-nNFBl-FqHTFnm6wt1cpPkgtpB0PfDVv0Lu9kF",
	  location: "Mulholland Drive",
	},
  };