export const vaultFactoryAbi = [
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
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "vault",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "asset",
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
      name: "VaultDeployed",
      type: "event",
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
                  name: "stakingToken",
                  type: "address",
               },
               {
                  internalType: "string",
                  name: "shareTokenName",
                  type: "string",
               },
               {
                  internalType: "string",
                  name: "shareTokenSymbol",
                  type: "string",
               },
               {
                  internalType: "address",
                  name: "vaultRewardController",
                  type: "address",
               },
               {
                  internalType: "address",
                  name: "feeConfigController",
                  type: "address",
               },
            ],
            internalType: "struct IVaultFactory.VaultDetails",
            name: "vaultDetails",
            type: "tuple",
         },
         {
            components: [
               {
                  internalType: "address",
                  name: "receiver",
                  type: "address",
               },
               {
                  internalType: "address",
                  name: "token",
                  type: "address",
               },
               {
                  internalType: "uint256",
                  name: "feePercentage",
                  type: "uint256",
               },
            ],
            internalType: "struct FeeConfiguration.FeeConfig",
            name: "feeConfig",
            type: "tuple",
         },
      ],
      name: "deployVault",
      outputs: [
         {
            internalType: "address",
            name: "vault",
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
   {
      inputs: [
         {
            internalType: "string",
            name: "",
            type: "string",
         },
      ],
      name: "vaultDeployed",
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
