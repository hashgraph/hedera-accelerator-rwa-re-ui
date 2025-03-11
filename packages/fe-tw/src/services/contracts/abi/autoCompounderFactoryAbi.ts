export const autoCompounderFactoryAbi = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "OwnableInvalidOwner",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "OwnableUnauthorizedAccount",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "autoCompounder",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "vault",
				type: "address",
			},
			{
				indexed: false,
				internalType: "string",
				name: "name",
				type: "string",
			},
			{
				indexed: false,
				internalType: "string",
				name: "symbol",
				type: "string",
			},
		],
		name: "AutoCompounderDeployed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		name: "autoCompounderDeployed",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "salt",
				type: "string",
			},
			{
				components: [
					{
						internalType: "address",
						name: "uniswapV2Router",
						type: "address",
					},
					{
						internalType: "address",
						name: "vault",
						type: "address",
					},
					{
						internalType: "address",
						name: "usdc",
						type: "address",
					},
					{
						internalType: "string",
						name: "aTokenName",
						type: "string",
					},
					{
						internalType: "string",
						name: "aTokenSymbol",
						type: "string",
					},
				],
				internalType: "struct IAutoCompounderFactory.AutoCompounderDetails",
				name: "autoCompounderDetails",
				type: "tuple",
			},
		],
		name: "deployAutoCompounder",
		outputs: [
			{
				internalType: "address",
				name: "autoCompounder",
				type: "address",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4",
			},
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
