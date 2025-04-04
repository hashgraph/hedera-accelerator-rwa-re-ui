export const asyncVaultAbi = [
   {
      inputs: [
         {
            internalType: "contract IERC20",
            name: "_underlying",
            type: "address",
         },
         {
            internalType: "string",
            name: "_name",
            type: "string",
         },
         {
            internalType: "string",
            name: "_symbol",
            type: "string",
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
            name: "_feeConfig",
            type: "tuple",
         },
         {
            internalType: "address",
            name: "_vaultRewardController",
            type: "address",
         },
         {
            internalType: "address",
            name: "_feeConfigController",
            type: "address",
         },
      ],
      stateMutability: "payable",
      type: "constructor",
   },
   {
      inputs: [],
      name: "AccessControlBadConfirmation",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "account",
            type: "address",
         },
         {
            internalType: "bytes32",
            name: "neededRole",
            type: "bytes32",
         },
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "target",
            type: "address",
         },
      ],
      name: "AddressEmptyCode",
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
      name: "AddressInsufficientBalance",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "spender",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "allowance",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
         },
      ],
      name: "ERC20InsufficientAllowance",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
         },
      ],
      name: "ERC20InsufficientBalance",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "approver",
            type: "address",
         },
      ],
      name: "ERC20InvalidApprover",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "receiver",
            type: "address",
         },
      ],
      name: "ERC20InvalidReceiver",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "sender",
            type: "address",
         },
      ],
      name: "ERC20InvalidSender",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "spender",
            type: "address",
         },
      ],
      name: "ERC20InvalidSpender",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "receiver",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "max",
            type: "uint256",
         },
      ],
      name: "ERC4626ExceededMaxDeposit",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "receiver",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "max",
            type: "uint256",
         },
      ],
      name: "ERC4626ExceededMaxMint",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "max",
            type: "uint256",
         },
      ],
      name: "ERC4626ExceededMaxRedeem",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "max",
            type: "uint256",
         },
      ],
      name: "ERC4626ExceededMaxWithdraw",
      type: "error",
   },
   {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
   },
   {
      inputs: [],
      name: "InvalidController",
      type: "error",
   },
   {
      inputs: [],
      name: "InvalidOperator",
      type: "error",
   },
   {
      inputs: [],
      name: "MathOverflowedMulDiv",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "maxDeposit",
            type: "uint256",
         },
      ],
      name: "MaxDepositRequestExceeded",
      type: "error",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "maxShares",
            type: "uint256",
         },
      ],
      name: "MaxRedeemRequestExceeded",
      type: "error",
   },
   {
      inputs: [],
      name: "MaxRewardTokensAmount",
      type: "error",
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
      inputs: [
         {
            internalType: "address",
            name: "token",
            type: "address",
         },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
   },
   {
      inputs: [],
      name: "SharesLocked",
      type: "error",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
         },
      ],
      name: "Approval",
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
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "Deposit",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            indexed: false,
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      name: "DepositRequested",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
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
            indexed: false,
            internalType: "struct FeeConfiguration.FeeConfig",
            name: "feeConfig",
            type: "tuple",
         },
      ],
      name: "FeeConfigUpdated",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
         },
         {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
         },
      ],
      name: "OperatorSet",
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
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            indexed: false,
            internalType: "address",
            name: "sender",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "RedeemRequested",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "rewardToken",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
         },
      ],
      name: "RewardAdded",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
         },
         {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
         },
      ],
      name: "RoleAdminChanged",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
         },
      ],
      name: "RoleGranted",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
         },
      ],
      name: "RoleRevoked",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: "uint24",
            name: "time",
            type: "uint24",
         },
      ],
      name: "SetSharesLockTime",
      type: "event",
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
         },
      ],
      name: "Transfer",
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
            indexed: true,
            internalType: "address",
            name: "receiver",
            type: "address",
         },
         {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            indexed: false,
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "Withdraw",
      type: "event",
   },
   {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
         {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "FEE_CONFIG_CONTROLLER_ROLE",
      outputs: [
         {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "VAULT_REWARD_CONTROLLER_ROLE",
      outputs: [
         {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_token",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
         },
      ],
      name: "addReward",
      outputs: [],
      stateMutability: "payable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
         {
            internalType: "address",
            name: "spender",
            type: "address",
         },
      ],
      name: "allowance",
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
            name: "spender",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "value",
            type: "uint256",
         },
      ],
      name: "approve",
      outputs: [
         {
            internalType: "bool",
            name: "",
            type: "bool",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "asset",
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
            internalType: "address",
            name: "account",
            type: "address",
         },
      ],
      name: "balanceOf",
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
            internalType: "uint256",
            name: "_startPosition",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "_receiver",
            type: "address",
         },
      ],
      name: "claimAllReward",
      outputs: [
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
         {
            internalType: "uint256",
            name: "",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "convertToAssets",
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
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      name: "convertToShares",
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
      name: "decimals",
      outputs: [
         {
            internalType: "uint8",
            name: "",
            type: "uint8",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
      ],
      name: "deposit",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
      ],
      name: "deposit",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "feeConfig",
      outputs: [
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
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_user",
            type: "address",
         },
      ],
      name: "getAllRewards",
      outputs: [
         {
            internalType: "uint256[]",
            name: "_rewards",
            type: "uint256[]",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "getRewardTokens",
      outputs: [
         {
            internalType: "address[]",
            name: "",
            type: "address[]",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
      ],
      name: "getRoleAdmin",
      outputs: [
         {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "_user",
            type: "address",
         },
         {
            internalType: "address",
            name: "_rewardToken",
            type: "address",
         },
      ],
      name: "getUserReward",
      outputs: [
         {
            internalType: "uint256",
            name: "unclaimedAmount",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            internalType: "address",
            name: "account",
            type: "address",
         },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            internalType: "address",
            name: "account",
            type: "address",
         },
      ],
      name: "hasRole",
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
            name: "controller",
            type: "address",
         },
         {
            internalType: "address",
            name: "operator",
            type: "address",
         },
      ],
      name: "isOperator",
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
            name: "owner",
            type: "address",
         },
      ],
      name: "maxDeposit",
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
            name: "owner",
            type: "address",
         },
      ],
      name: "maxMint",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
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
            name: "owner",
            type: "address",
         },
      ],
      name: "maxRedeem",
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
            name: "owner",
            type: "address",
         },
      ],
      name: "maxWithdraw",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
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
            name: "assets",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
      ],
      name: "mint",
      outputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [],
      name: "name",
      outputs: [
         {
            internalType: "string",
            name: "",
            type: "string",
         },
      ],
      stateMutability: "view",
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
      inputs: [
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
      ],
      name: "pendingDepositRequest",
      outputs: [
         {
            internalType: "uint256",
            name: "assets",
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
            name: "owner",
            type: "address",
         },
      ],
      name: "pendingRedeemRequest",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      name: "previewDeposit",
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
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "previewMint",
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
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      name: "previewRedeem",
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
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      name: "previewWithdraw",
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
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "receiver",
            type: "address",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
      ],
      name: "redeem",
      outputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
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
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            internalType: "address",
            name: "callerConfirmation",
            type: "address",
         },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
      ],
      name: "requestDeposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
         {
            internalType: "address",
            name: "owner",
            type: "address",
         },
      ],
      name: "requestRedeem",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
         },
         {
            internalType: "address",
            name: "account",
            type: "address",
         },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "operator",
            type: "address",
         },
         {
            internalType: "bool",
            name: "approved",
            type: "bool",
         },
      ],
      name: "setOperator",
      outputs: [
         {
            internalType: "bool",
            name: "success",
            type: "bool",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint24",
            name: "time",
            type: "uint24",
         },
      ],
      name: "setSharesLockTime",
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
      inputs: [],
      name: "symbol",
      outputs: [
         {
            internalType: "string",
            name: "",
            type: "string",
         },
      ],
      stateMutability: "view",
      type: "function",
   },
   {
      inputs: [],
      name: "totalAssets",
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
      name: "totalSupply",
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
         {
            internalType: "uint256",
            name: "value",
            type: "uint256",
         },
      ],
      name: "transfer",
      outputs: [
         {
            internalType: "bool",
            name: "",
            type: "bool",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "address",
            name: "from",
            type: "address",
         },
         {
            internalType: "address",
            name: "to",
            type: "address",
         },
         {
            internalType: "uint256",
            name: "value",
            type: "uint256",
         },
      ],
      name: "transferFrom",
      outputs: [
         {
            internalType: "bool",
            name: "",
            type: "bool",
         },
      ],
      stateMutability: "nonpayable",
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
            name: "_feeConfig",
            type: "tuple",
         },
      ],
      name: "updateFeeConfig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
   },
   {
      inputs: [
         {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
         },
         {
            internalType: "address",
            name: "receiver",
            type: "address",
         },
         {
            internalType: "address",
            name: "controller",
            type: "address",
         },
      ],
      name: "withdraw",
      outputs: [
         {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
         },
      ],
      stateMutability: "nonpayable",
      type: "function",
   },
];
