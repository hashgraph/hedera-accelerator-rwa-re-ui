export const uniswapPairAbi = [
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
         },
         {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "Burn",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
         },
      ],
      name: "Mint",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount0In",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount1In",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount0Out",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount1Out",
            type: "uint256",
         },
         {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "Swap",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: "uint112",
            name: "reserve0",
            type: "uint112",
         },
         {
            indexed: false,
            internalType: "uint112",
            name: "reserve1",
            type: "uint112",
         },
      ],
      name: "Sync",
      type: "event",
   },
   {
      inputs: [],
      name: "MINIMUM_LIQUIDITY",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "pure",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "burn",
      outputs: [
         {
            internalType: "uint256",
            name: "amount0",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "amount1",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "factory",
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
      name: "getReserves",
      outputs: [
         {
            internalType: "uint112",
            name: "reserve0",
            type: "uint112",
         },
         {
            internalType: "uint112",
            name: "reserve1",
            type: "uint112",
         },
         {
            internalType: "uint32",
            name: "blockTimestampLast",
            type: "uint32",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "",
            type: "address",
         },
         {
            internalType: "address",
            name: "",
            type: "address",
         },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "kLast",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "mint",
      outputs: [
         {
            internalType: "uint256",
            name: "liquidity",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "price0CumulativeLast",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "price1CumulativeLast",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "skim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "amount0Out",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "amount1Out",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
         {
            internalType: "bytes",
            name: "data",
            type: "bytes",
         },
      ],
      name: "swap",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "sync",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "token0",
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
      name: "token1",
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
];
