export const buildingFactoryAbi = [
   {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
   },
   {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
   },
   {
      inputs: [],
      name: "NotInitializing",
      type: "error",
   },
   {
      "anonymous": false,
      "inputs": [
         {
            indexed: false,
            internalType: "uint64",
            name: "version",
            type: "uint64",
         },
      ],
      name: "Initialized",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: "address",
            name: "addr",
            type: "address",
         },
      ],
      name: "NewAuditRegistry",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            "indexed": false,
            "internalType": "address",
            "name": "addr",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
         }
      ],
      name: "NewBuilding",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            "indexed": false,
            "internalType": "address",
            "name": "token",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
         }
      ],
      name: "NewERC3643Token",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            "indexed": false,
            "internalType": "address",
            "name": "governance",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
         }
      ],
      "name": "NewGovernance",
      "type": "event"
   },
   {
      "anonymous": false,
      "inputs": [
         {
            "indexed": false,
            "internalType": "address",
            "name": "treasury",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            "indexed": false,
            "internalType": "address",
            "name": "initialOwner",
            "type": "address"
         }
      ],
      "name": "NewTreasury",
      "type": "event"
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "buildingAddress",
            type: "address",
         },
      ],
      name: "getBuildingDetails",
      outputs: [
         {
            components: [
               {
                  internalType: "address",
                  name: "addr",
                  type: "address",
               },
               {
                  internalType: "uint256",
                  name: "nftId",
                  type: "uint256",
               },
               {
                  internalType: "string",
                  name: "tokenURI",
                  type: "string",
               },
               {
                  internalType: "address",
                  name: "identity",
                  type: "address",
               },
               {
                  "internalType": "address",
                  "name": "erc3643Token",
                  "type": "address"
               },
               {
                  "internalType": "address",
                  "name": "treasury",
                  "type": "address"
               },
               {
                  "internalType": "address",
                  "name": "governance",
                  "type": "address"
               }
            ],
            "internalType": "struct BuildingFactoryStorage.BuildingInfo",
            "name": "",
            "type": "tuple"
         }
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getBuildingList",
      outputs: [
         {
            components: [
               {
                  internalType: "address",
                  name: "addr",
                  type: "address",
               },
               {
                  internalType: "uint256",
                  name: "nftId",
                  type: "uint256",
               },
               {
                  internalType: "string",
                  name: "tokenURI",
                  type: "string",
               },
               {
                  internalType: "address",
                  name: "identity",
                  type: "address",
               },
               {
                  "internalType": "address",
                  "name": "erc3643Token",
                  "type": "address"
               },
               {
                  "internalType": "address",
                  "name": "treasury",
                  "type": "address"
               },
               {
                  "internalType": "address",
                  "name": "governance",
                  "type": "address"
               }
            ],
            "internalType": "struct BuildingFactoryStorage.BuildingInfo[]",
            "name": "",
            "type": "tuple[]"
         }
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_nft",
            type: "address",
         },
         {
            internalType: "address",
            name: "_uniswapRouter",
            type: "address",
         },
         {
            internalType: "address",
            name: "_uniswapFactory",
            type: "address",
         },
         {
            "internalType": "address",
            "name": "_onchainIdGateway",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_trexGateway",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_usdc",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_buildingBeacon",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_vaultFactory",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_treasuryBeacon",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "_governanceBeacon",
            "type": "address"
         }
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "string",
            name: "tokenURI",
            type: "string",
         },
      ],
      name: "newBuilding",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            internalType: "string",
            name: "name",
            type: "string",
         },
         {
            internalType: "string",
            name: "symbol",
            type: "string",
         },
         {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
         },
      ],
      name: "newERC3643Token",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      "inputs": [
         {
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            "internalType": "string",
            "name": "name",
            "type": "string"
         },
         {
            "internalType": "address",
            "name": "token",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "treasury",
            "type": "address"
         }
      ],
      "name": "newGovernance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
   },
   {
      inputs: [
         {
            "internalType": "address",
            "name": "building",
            "type": "address"
         },
         {
            "internalType": "address",
            "name": "token",
            "type": "address"
         },
         {
            "internalType": "uint256",
            "name": "reserveAmount",
            "type": "uint256"
         },
         {
            "internalType": "uint256",
            "name": "nPercentage",
            "type": "uint256"
         }
      ],
      "name": "newTreasury",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
   }
];
