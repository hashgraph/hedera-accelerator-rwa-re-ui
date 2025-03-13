export const trexFactoryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "implementationAuthority_",
        internalType: "address",
        type: "address",
      },
      { name: "idFactory_", internalType: "address", type: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "OwnableInvalidOwner",
  },
  {
    type: "error",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "OwnableUnauthorizedAccount",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_addr",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Deployed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_idFactory",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "IdFactorySet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_implementationAuthority",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "ImplementationAuthoritySet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "previousOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "_token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "_ir", internalType: "address", type: "address", indexed: false },
      {
        name: "_irs",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "_tir",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "_ctr",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      { name: "_mc", internalType: "address", type: "address", indexed: false },
      { name: "_salt", internalType: "string", type: "string", indexed: true },
    ],
    name: "TREXSuiteDeployed",
  },
  {
    type: "function",
    inputs: [
      { name: "_salt", internalType: "string", type: "string" },
      {
        name: "_tokenDetails",
        internalType: "struct ITREXFactory.TokenDetails",
        type: "tuple",
        components: [
          { name: "owner", internalType: "address", type: "address" },
          { name: "name", internalType: "string", type: "string" },
          { name: "symbol", internalType: "string", type: "string" },
          { name: "decimals", internalType: "uint8", type: "uint8" },
          { name: "irs", internalType: "address", type: "address" },
          { name: "ONCHAINID", internalType: "address", type: "address" },
          { name: "irAgents", internalType: "address[]", type: "address[]" },
          { name: "tokenAgents", internalType: "address[]", type: "address[]" },
          {
            name: "complianceModules",
            internalType: "address[]",
            type: "address[]",
          },
          {
            name: "complianceSettings",
            internalType: "bytes[]",
            type: "bytes[]",
          },
        ],
      },
      {
        name: "_claimDetails",
        internalType: "struct ITREXFactory.ClaimDetails",
        type: "tuple",
        components: [
          { name: "claimTopics", internalType: "uint256[]", type: "uint256[]" },
          { name: "issuers", internalType: "address[]", type: "address[]" },
          {
            name: "issuerClaims",
            internalType: "uint256[][]",
            type: "uint256[][]",
          },
        ],
      },
    ],
    name: "deployTREXSuite",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "getIdFactory",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getImplementationAuthority",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_salt", internalType: "string", type: "string" }],
    name: "getToken",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_contract", internalType: "address", type: "address" },
      { name: "_newOwner", internalType: "address", type: "address" },
    ],
    name: "recoverContractOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "idFactory_", internalType: "address", type: "address" }],
    name: "setIdFactory",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "implementationAuthority_",
        internalType: "address",
        type: "address",
      },
    ],
    name: "setImplementationAuthority",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "string", type: "string" }],
    name: "tokenDeployed",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
