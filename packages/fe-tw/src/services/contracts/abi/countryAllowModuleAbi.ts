export const countryAllowModuleAbi = [
   {
      inputs: [
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
         {
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "CountryAlreadyAllowed",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
         {
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "CountryNotAllowed",
      type: "error",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "ComplianceBound",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "ComplianceUnbound",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "CountryAllowed",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "CountryUnallowed",
      type: "event",
   },
   {
      inputs: [
         {
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "addAllowedCountry",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint16[]",
            name: "_countries",
            type: "uint16[]",
         },
      ],
      name: "batchAllowCountries",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint16[]",
            name: "_countries",
            type: "uint16[]",
         },
      ],
      name: "batchDisallowCountries",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "bindCompliance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "",
            type: "address",
         },
      ],
      name: "canComplianceBind",
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
            name: "compliance",
            type: "address",
         },
      ],
      name: "getAllowedCountries",
      outputs: [
         {
            internalType: "uint16[]",
            name: "",
            type: "uint16[]",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "isComplianceBound",
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
            name: "_compliance",
            type: "address",
         },
         {
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "isCountryAllowed",
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
      inputs: [],
      name: "isPlugAndPlay",
      outputs: [
         {
            internalType: "bool",
            name: "",
            type: "bool",
         },
      ],
      stateMutability: "pure",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_from",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
         },
      ],
      name: "moduleBurnAction",
      outputs: [],
      stateMutability: "nonpayable",
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
            name: "_to",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "moduleCheck",
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
            name: "_to",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
         },
      ],
      name: "moduleMintAction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_from",
            type: "address",
         },
         {
            internalType: "address",
            name: "_to",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
         },
      ],
      name: "moduleTransferAction",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "name",
      outputs: [
         {
            internalType: "string",
            name: "_name",
            type: "string",
         },
      ],
      stateMutability: "pure",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint16",
            name: "_country",
            type: "uint16",
         },
      ],
      name: "removeAllowedCountry",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_compliance",
            type: "address",
         },
      ],
      name: "unbindCompliance",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
];
