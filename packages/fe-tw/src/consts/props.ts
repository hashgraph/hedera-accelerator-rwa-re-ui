import type {
	SliceData,
	BuildingData,
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
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
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
			"Lorem ipsum odor amet, consectetuer adipiscing elit. Viverra tristique maecenas sociosqu vel varius pulvinar pretium potenti.",
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
		imageUrl: '/assets/dome.jpeg',
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
		imageUrl: '/assets/dome.jpeg',
	},
];

export const buildings: BuildingData[] = [
	{
		id: 1234,
		title: 'River City Apartments - Chicago',
		purchasedAt: 1733398424098,
		description: 'Lorem ispum dolor dolor dolor',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
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
		partOfSlices: [1, 2],
		allocation: 40, 
	},
	{
		id: 5678,
		title: 'Green City Apartments - New York',
		purchasedAt: 1733398424098,
		description: 'Lorem ispum dolor dolor dolor',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
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
		partOfSlices: [1, 3],
		allocation: 35, 
	},
	{
		id: 9101,
		title: 'Tribune Tower',
		purchasedAt: 1733398424098,
		description: 'Historic Chicago landmark.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 10,
				tokenPrice: 12,
				directExposure: 1200,
				yield: [{ percentage: 5, days: 90 }],
				treasury: 3000,
			},
			demographics: {
				constructedYear: 1925,
				type: 'Hi-Rise',
				location: '60611 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [1],
		partOfSlices: [1, 2],
		allocation: 25,
	},
	{
		id: 1121,
		title: 'Willis Tower',
		purchasedAt: 1733398424098,
		description: 'Iconic Chicago skyscraper.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 40,
				tokenPrice: 20,
				directExposure: 8000,
				yield: [{ percentage: 15, days: 60 }],
				treasury: 20000,
			},
			demographics: {
				constructedYear: 1973,
				type: 'Hi-Rise',
				location: '60606 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [1],
		partOfSlices: [1, 2],
		allocation: 20,
	},
	{
		id: 3344,
		title: 'Stadium A',
		purchasedAt: 1733398424098,
		description: 'State-of-the-art stadium for sports.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 25,
				tokenPrice: 15,
				directExposure: 3750,
				yield: [{ percentage: 10, days: 45 }],
				treasury: 15000,
			},
			demographics: {
				constructedYear: 2010,
				type: 'Stadium',
				location: '60707 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [1],
		partOfSlices: [1, 4],
		allocation: 15,
	},
	{
		id: 5566,
		title: 'Retail Park B',
		purchasedAt: 1733398424098,
		description: 'Vibrant retail park.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 20,
				tokenPrice: 10,
				directExposure: 2000,
				yield: [{ percentage: 8, days: 30 }],
				treasury: 10000,
			},
			demographics: {
				constructedYear: 2000,
				type: 'Retail',
				location: '60615 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [1],
		partOfSlices: [1, 5],
		allocation: 10,
	},
	{
		id: 7777,
		title: 'Inner City Apartments',
		purchasedAt: 1733398424098,
		description: 'Apartments in inner Chicago.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 30,
				tokenPrice: 9,
				directExposure: 2000,
				yield: [{ percentage: 10, days: 50 }],
				treasury: 7000,
			},
			demographics: {
				constructedYear: 2015,
				type: 'Hi-Rise',
				location: 'Inner Circle (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [],
		partOfSlices: [1,2],
		allocation: 30,
	},
	{
		id: 8888,
		title: 'Lo-Rise Apartments Chicago',
		purchasedAt: 1733398424098,
		description: 'Lo-Rise building in Chicago Urban area.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 50,
				tokenPrice: 7,
				directExposure: 1300,
				yield: [{ percentage: 5, days: 60 }],
				treasury: 5000,
			},
			demographics: {
				constructedYear: 2018,
				type: 'Lo-Rise',
				location: '60613 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [],
		partOfSlices: [1,3],
		allocation: 25,
	},
	{
		id: 9999,
		title: 'Commercial Tower Chicago',
		purchasedAt: 1733398424098,
		description: 'Commercial tower in Chicago urban district.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 60,
				tokenPrice: 25,
				directExposure: 9000,
				yield: [{ percentage: 12, days: 40 }],
				treasury: 25000,
			},
			demographics: {
				constructedYear: 2010,
				type: 'Commercial',
				location: '60622 (US / Chicago)',
				locationType: 'Urban',
			},
		},
		votingItems: [],
		partOfSlices: [1,6],
		allocation: 15,
	},
	{
		id: 1112,
		title: 'Lo-Rise Suburban Housing Boise',
		purchasedAt: 1733398424098,
		description: 'Lo-Rise housing in suburban Boise.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 80,
				tokenPrice: 5,
				directExposure: 1000,
				yield: [{ percentage: 3, days: 30 }],
				treasury: 2000,
			},
			demographics: {
				constructedYear: 2020,
				type: 'Lo-Rise',
				location: 'Suburban (US / Boise)',
				locationType: 'Inner',
			},
		},
		votingItems: [],
		partOfSlices: [7,3],
		allocation: 20,
	},
	{
		id: 2223,
		title: 'Boise Stadium Central',
		purchasedAt: 1733398424098,
		description: 'A stadium in Boise urban area.',
		imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
		info: {
			financial: {
				percentageOwned: 40,
				tokenPrice: 10,
				directExposure: 3000,
				yield: [{ percentage: 7, days: 20 }],
				treasury: 8000,
			},
			demographics: {
				constructedYear: 2022,
				type: 'Stadium',
				location: 'Downtown (US / Boise)',
				locationType: 'Urban',
			},
		},
		votingItems: [],
		partOfSlices: [7,4],
		allocation: 30,
	},
];

export const buildingSlices = [
	{
		imageUrl: "https://as1.ftcdn.net/v2/jpg/00/35/35/40/1000_F_35354022_kVyRIi42r1EReIdrVQ7iXANMZ3zeDNio.jpg",
		name: "Chicago",
		description: "A dynamic urban hub with thriving commercial and residential developments.",
		estimatedPrice: 50,
		timeToEnd: 1000000,
		allocation: 20,
		id: 1,
	},
	{
		imageUrl: "https://plus.unsplash.com/premium_photo-1681628908570-3c95bed77a8e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5uZXIlMjBjaXR5fGVufDB8fDB8fHww",
		name: "Inner Urban",
		description: "Exclusive inner-city living spaces with modern conveniences and amenities.",
		estimatedPrice: 40,
		timeToEnd: 1200000,
		allocation: 15,
		id: 2,
	},
	{
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXUPwY201GmkOEUwqT41vWsensT3WyS_0MKg&s",
		name: "Lo-Rise",
		description: "Charming low-rise buildings providing affordable yet stylish living.",
		estimatedPrice: 30,
		timeToEnd: 800000,
		allocation: 10,
		id: 3,
	},
	{
		imageUrl: "https://ca-times.brightspotcdn.com/dims4/default/ba0c5a1/2147483647/strip/true/crop/7872x5247+95+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F63%2F4d%2F265a177543e6a76e7559aa0e5210%2F1243075903.jpg",
		name: "Stadiums",
		description: "Premier stadium developments supporting sports and large-scale events.",
		estimatedPrice: 70,
		timeToEnd: 1500000,
		allocation: 25,
		id: 4,
	},
	{
		imageUrl: "https://media.istockphoto.com/id/135877652/photo/new-shopping-center.jpg?s=612x612&w=0&k=20&c=rmPt1VBDUhPI_nqvtOL7xgKUtk1n-HjLZi--njdgBPc=",
		name: "Retail",
		description: "Vibrant retail spaces catering to businesses and consumers alike.",
		estimatedPrice: 60,
		timeToEnd: 1400000,
		allocation: 20,
		id: 5,
	},
	{
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQCZiF9KDK5AoOf9Zinpwty3z4uRb9IhKq6g&s",
		name: "Commercial",
		description: "Modern commercial developments designed to drive business growth.",
		estimatedPrice: 80,
		timeToEnd: 1800000,
		allocation: 30,
		id: 6,
	},
];

export const buildingSliceCategories = [
	{
		id: 1,
		title: 'Featured Development started in Chicago Highs',
		name: 'chicago',
		items: buildingSlices.filter(slice => slice.id === 1),
		itemsSize: 'lg',
	},
	{
		id: 2,
		title: "Chicago Inner-Urban Residential Slice",
		name: "inner-urban-residential",
		items: buildingSlices.filter(slice => [1, 2].includes(slice.id)),
		itemsSize: 'lg',
	},
];

export const slices: SliceData[] = [
	{
		imageUrl: "https://as1.ftcdn.net/v2/jpg/00/35/35/40/1000_F_35354022_kVyRIi42r1EReIdrVQ7iXANMZ3zeDNio.jpg",
		name: "Chicago",
		id: 1,
	},
	{
		imageUrl: "https://plus.unsplash.com/premium_photo-1681628908570-3c95bed77a8e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5uZXIlMjBjaXR5fGVufDB8fDB8fHww",
		name: "Inner Urban",
		id: 2,
	},
	{
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXUPwY201GmkOEUwqT41vWsensT3WyS_0MKg&s",
		name: "Lo-Rise",
		id: 3,
	},
	{
		imageUrl: "https://ca-times.brightspotcdn.com/dims4/default/ba0c5a1/2147483647/strip/true/crop/7872x5247+95+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F63%2F4d%2F265a177543e6a76e7559aa0e5210%2F1243075903.jpg",
		name: "Stadiums",
		id: 4,
	},
	{
		imageUrl: "https://media.istockphoto.com/id/135877652/photo/new-shopping-center.jpg?s=612x612&w=0&k=20&c=rmPt1VBDUhPI_nqvtOL7xgKUtk1n-HjLZi--njdgBPc=",
		name: "Retail",
		id: 5,
	},
	{
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQCZiF9KDK5AoOf9Zinpwty3z4uRb9IhKq6g&s",
		name: "Commercial",
		id: 6,
	},
	{
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy9N48mjXHzb64Nk8S8Fy46ZeDTCg_ZymrNg&s",
		name: "Boise",
		id: 7,
	},
];

export const featuredDevelopments = [
    {
        id: 1,
        title: "The 78 - Chicago",
        estimatedPrice: 5,
        daysLeft: 4,
        location: "chicago",
        imageUrl: "https://www.thehousedesigners.com/images/plans/01/URD/bulk/6583/the-destination-front-rendering_m.webp",
        timeToEnd: 345600,
    },
    {
        id: 2,
        title: "Obama Presidential Center",
        estimatedPrice: 7,
        daysLeft: 30,
        location: "chicago",
        imageUrl: "https://www.thehousedesigners.com/images/plans/01/URD/bulk/6583/the-destination-front-rendering_m.webp",
        timeToEnd: 2592000,
    }
];

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
	"0xTokenA": { buildingId: 1234 },
	"0xTokenB": { buildingId: 5678 },
	"0xTokenC": { buildingId: 9101 },
};