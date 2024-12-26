import type { BuildingData } from "@/types/erc3643/types";

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
		votingItems: [1, 6, 9],
		partOfSlices: [1, 2],
		allocation: 40,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [2, 7],
		partOfSlices: [1, 3],
		allocation: 35, 
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [3, 8],
		partOfSlices: [1, 2],
		allocation: 25,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [1, 10],
		partOfSlices: [1, 2],
		allocation: 20,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [2, 3],
		partOfSlices: [1, 4],
		allocation: 15,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [5],
		partOfSlices: [1, 5],
		allocation: 10,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [8],
		partOfSlices: [1,6],
		allocation: 15,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [6, 7],
		partOfSlices: [7,3],
		allocation: 20,
		copeIpfsHash: "QmMockCopeHashFor1234" 
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
		votingItems: [9, 10],
		partOfSlices: [7,4],
		allocation: 30,
		copeIpfsHash: "QmMockCopeHashFor1234" 
	},
];
