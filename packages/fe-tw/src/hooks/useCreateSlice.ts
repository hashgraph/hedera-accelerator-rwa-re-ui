import { useEvmAddress, useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useMutation } from "@tanstack/react-query";
import * as uuid from "uuid";
import { MaxUint256, parseUnits, ZeroAddress } from "ethers";
import { useExecuteTransaction } from "./useExecuteTransaction";
import useWriteContract from "./useWriteContract";
import { readBuildingDetails } from "@/hooks/useBuildings";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import {
   UNISWAP_ROUTER_ADDRESS,
   USDC_ADDRESS,
   SLICE_FACTORY_ADDRESS,
   CHAINLINK_PRICE_ID,
   BUILDING_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { CreateSliceRequestData } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import { TransactionExtended } from "@/types/common";
import { uniswapFactoryAbi } from "@/services/contracts/abi/uniswapFactoryAbi";
import { readContract } from "@/services/contracts/readContract";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { tryCatch } from "@/services/tryCatch";
import { useUploadImageToIpfs } from "./useUploadImageToIpfs";

type VaultData = {
   vault: `0x${string}`,
   token: `0x${string}`,
   ac: `0x${string}`,
   allocation: number,
   address: `0x${string}`,
}

export function useCreateSlice(sliceAddress?: `0x${string}`) {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { executeTransaction } = useExecuteTransaction();
   const { uploadImage } = useUploadImageToIpfs();
   const { data: evmAddress } = useEvmAddress();

   const depositsInBatch = async (
      assets: string[],
      assetId: number,
      txResults: string[],
      depositAmount: BigInt,
      deployedSliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, assets[assetId]),
               abi: basicVaultAbi,
               functionName: "deposit",
               args: [depositAmount, evmAddress],
            }),
         );

         return depositsInBatch(assets, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], depositAmount, deployedSliceAddress);
      }

      return txResults;
   };

   const depositsToSliceInBatch = async (
      assets: string[],
      assetId: number,
      txResults: string[],
      depositAmount: BigInt,
      deployedSliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, deployedSliceAddress || sliceAddress!),
               abi: sliceAbi,
               functionName: "deposit",
               args: [assets[assetId], depositAmount],
            }),
         );

         return depositsToSliceInBatch(assets, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], depositAmount, deployedSliceAddress);
      }

      return txResults;
   };

   const approvalsInBatch = async (
      assets: string[],
      amounts: BigInt[],
      assetId: number,
      txResults: string[],
      approveAddress: `0x${string}`,
      reverseApproval: boolean = false,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, (reverseApproval ? approveAddress : assets[assetId])),
               abi: tokenAbi,
               functionName: "approve",
               args: [(reverseApproval ? assets[assetId] : approveAddress), amounts[assetId]],
            }),
         );

         return approvalsInBatch(assets, amounts, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], approveAddress, reverseApproval);
      }

      return txResults;
   };

   const addAllocationInBatch = async (
      assets: string[],
      amounts: number[],
      assetId: number,
      txResults: string[],
      deployedSliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               functionName: 'addAllocation',
               args: [assets[assetId], CHAINLINK_PRICE_ID, amounts[assetId]],
               abi: sliceAbi,
               contractId: ContractId.fromEvmAddress(0, 0, deployedSliceAddress || sliceAddress!),
            }),
         );

         return addAllocationInBatch(assets, amounts, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], deployedSliceAddress);
      }

      return txResults;
   };

   const createIdentityInBatch: any = async (
      assets: { tokenA: string, tokenB: string, building: string, vaultA: string }[],
      assetId: number,
      deployedSliceAddress: string,
      txResults: string[],
   ) => {
      if (assets[assetId]) {
         const uniswapFactory = await readContract({
            address: assets[assetId].building,
            abi: buildingAbi,
            functionName: "getUniswapFactory",
            args: [],
         });
         await tryCatch(executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: 'deployIdentityForWallet',
            args: [deployedSliceAddress ?? sliceAddress],
         })));
         await tryCatch(executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: 'registerIdentity',
            args: [assets[assetId].building, deployedSliceAddress ?? sliceAddress, 840],
         })));
         let createPairResult;
         let deployIdentityResult;
         let pairAddressExists = await readContract({
            address: uniswapFactory[0],
            abi: uniswapFactoryAbi,
            functionName: 'getPair',
            args: [assets[assetId].tokenA, assets[assetId].tokenB],
         });
         let identityExists = await readContract({
            address: BUILDING_FACTORY_ADDRESS,
            abi: buildingFactoryAbi,
            functionName: 'getIdentity',
            args: [pairAddressExists[0]],
         });
         
         if (pairAddressExists[0] === ZeroAddress) {
            createPairResult = await executeTransaction(() => writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, uniswapFactory[0]),
               abi: uniswapFactoryAbi,
               functionName: 'createPair',
               args: [assets[assetId].tokenA, assets[assetId].tokenB],
            }));
            pairAddressExists = await readContract({
               address: uniswapFactory[0],
               abi: uniswapFactoryAbi,
               functionName: 'getPair',
               args: [assets[assetId].tokenA, assets[assetId].tokenB],
            });
         }

         if (identityExists[0] === ZeroAddress) {
            deployIdentityResult = await executeTransaction(() => writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
               abi: buildingFactoryAbi,
               functionName: 'deployIdentityForWallet',
               args: [pairAddressExists[0]],
            }));
            identityExists = await readContract({
               address: BUILDING_FACTORY_ADDRESS,
               abi: buildingFactoryAbi,
               functionName: 'getIdentity',
               args: [pairAddressExists[0]],
            });
         }
      
         await tryCatch(executeTransaction(() => writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: 'registerIdentity',
            args: [assets[assetId].building, pairAddressExists[0], 840],
         })) as any);
         
         return createIdentityInBatch(assets, assetId + 1, deployedSliceAddress, [
            ...txResults,
            [
               (createPairResult as { transaction_id: string })?.transaction_id,
               (deployIdentityResult as { transaction_id: string })?.transaction_id,
            ]
         ]);
      }

      return txResults;
   }

   const addLiquidityInBatch: any = async (
      assets: string[],
      assetId: number,
      txResults: string[],
      rewardsAmountA: BigInt,
      rewardsAmountB: BigInt,
      deployedSliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               functionName: 'addLiquidity',
               args: [
                  USDC_ADDRESS,
                  assets[assetId],
                  rewardsAmountA,
                  rewardsAmountB,
                  parseUnits('1', 6),
                  parseUnits('1', 18),
                  evmAddress,
                  MaxUint256
               ],
               abi: uniswapRouterAbi,
               contractId: ContractId.fromEvmAddress(0, 0, UNISWAP_ROUTER_ADDRESS),
            }),
         );

         return addLiquidityInBatch(assets, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], rewardsAmountA, rewardsAmountB, deployedSliceAddress);
      }

      return txResults;
   };

   const addRewardInBatch = async (
      assets: string[],
      assetId: number,
      txResults: string[],
      rewardsAmount: BigInt,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               functionName: 'addReward',
               args: [USDC_ADDRESS, rewardsAmount],
               abi: basicVaultAbi,
               contractId: ContractId.fromEvmAddress(0, 0, assets[assetId]),
            }),
         );

         return addRewardInBatch(assets, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], rewardsAmount);
      }

      return txResults;
   };

   const addRewardsIntoSliceMutation = useMutation({
      mutationFn: async ({
         rewardAmount, depositAmount, vaults, deployedSliceAddress
      }: { rewardAmount: string, depositAmount: string, vaults: VaultData[], deployedSliceAddress?: `0x${string}` }) => {
         const rewardsAmountToInUSDC = parseUnits(rewardAmount, 6);
         const rewardsAmountToInStaking = parseUnits(rewardAmount, 18);
         const depositAmountTo = parseUnits(depositAmount, 18);
         const tokensToApprove = [...vaults.map((v) => v.token), USDC_ADDRESS];
         let txHashes = [];

         await createIdentityInBatch(vaults.map((vault) => ({
            tokenA: vault.token,
            tokenB: USDC_ADDRESS,
            building: vault.address,
            vaultA: vault.vault,
         })), 0, deployedSliceAddress, []);

         const approvalsHashes = await approvalsInBatch(
            tokensToApprove,
            tokensToApprove.map(_t => _t === USDC_ADDRESS ?
               parseUnits((Number(rewardAmount) * vaults.length).toString(), 6) : rewardsAmountToInStaking
            ),
            0,
            [],
            UNISWAP_ROUTER_ADDRESS,
         );
         txHashes.push(...approvalsHashes);

         const addLiquidityHashes = await addLiquidityInBatch(
            vaults.map((v) => v.token),
            0,
            [],
            rewardsAmountToInUSDC,
            rewardsAmountToInStaking,
            deployedSliceAddress,
         );
         txHashes.push(...addLiquidityHashes);

         const approveRewardsHashes = await approvalsInBatch(
            [...vaults.map(v => v.token), ...vaults.map(v => v.vault)],
            [...vaults.map(v => v.token), ...vaults.map(v => v.vault)].map(_t => rewardsAmountToInStaking),
            0,
            [],
            USDC_ADDRESS,
         );
         txHashes.push(...approveRewardsHashes);

         const addAllocationsHashes = await addAllocationInBatch(
            vaults.map(v => v.ac),
            vaults.map(v => v.allocation),
            0,
            [],
            deployedSliceAddress,
         );
         txHashes.push(...addAllocationsHashes);

         const approveDepositsHashes = await approvalsInBatch(
            vaults.map(v => v.token),
            vaults.map(_v => depositAmountTo),
            0,
            [],
            deployedSliceAddress || sliceAddress!,
         );
         txHashes.push(...approveDepositsHashes);

         const depositsHashes = await depositsToSliceInBatch(
            vaults.map(v => v.ac),
            0,
            [],
            depositAmountTo,
            deployedSliceAddress || sliceAddress!
         );
         txHashes.push(...depositsHashes);

         const approveRewardsHashes2 = await approvalsInBatch(
            vaults.map(v => v.vault),
            vaults.map(_v => rewardsAmountToInUSDC),
            0,
            [],
            USDC_ADDRESS,
            true,
         );
         txHashes.push(...approveRewardsHashes2);
      
         const addRewardsHashes = await addRewardInBatch(
            vaults.map(v => v.vault),
            0,
            [],
            rewardsAmountToInUSDC,
         );
         txHashes.push(...addRewardsHashes);
      
         try {
            const tx = await waitForDelayedRebalance({ deployedSliceAddress });

            return [tx.transaction_id, ...txHashes];
         } catch (err: any) {
            throw new Error(err.message);
         }
      },
   });

   const addTokenAssetsToSliceMutation = useMutation({
      mutationFn: async (values: CreateSliceRequestData) => {
         const { sliceAllocation, deployedSliceAddress } = values;
         const { tokenAssets, tokenAssetAmounts } = sliceAllocation;

         const buildingDetails = await Promise.all(tokenAssets?.map((building) => readBuildingDetails(building)));
         const vaultsInfo = buildingDetails.map((detailLog) => ({
            address: detailLog[0][0],
            token: detailLog[0][4],
            vault: detailLog[0][7],
            ac: detailLog[0][8],
            allocation: Number(tokenAssetAmounts[detailLog[0][0]]),
         }));

         let txs = await addRewardsIntoSliceMutation.mutateAsync({
            rewardAmount: values.sliceAllocation?.rewardAmount!,
            depositAmount: values.sliceAllocation?.depositAmount!,
            vaults: vaultsInfo,
            deployedSliceAddress,
         });

         return txs;
      },
   });

   const waitForDelayedRebalance = (values: {
      deployedSliceAddress?: `0x${string}`,
   }): Promise<TransactionExtended> => {
      return new Promise((res, rej) => {
         setTimeout(() => {
            executeTransaction(() => writeContract({
               functionName: 'rebalance',
               args: [],
               abi: sliceAbi,
               contractId: ContractId.fromEvmAddress(0, 0, values.deployedSliceAddress || sliceAddress!),
            })).then((transaction) => {
               res(transaction as TransactionExtended);
            }).catch((err) => {
               rej(err);
            });
         }, 60000);
      });
   };

   const waitForLastSliceDeployed = (): Promise<`0x${string}` | undefined> => {
      return new Promise((res) => {
         let logs: any = [];

         const unsubscribe = watchContractEvent({
            address: SLICE_FACTORY_ADDRESS,
            abi: sliceFactoryAbi,
            eventName: "SliceDeployed",
            onLogs: (data: any) => {
               logs = [...logs, ...data];
            },
         });

         setTimeout(() => {
            const lastSlice = [...logs].pop().args[0];

            if (lastSlice) {
               res(lastSlice);
               unsubscribe();
            } else {
               res(undefined);
            }
         }, 10000);
      });
   };

   const createSlice = async (values: CreateSliceRequestData): Promise<TransactionExtended> => {
      const { slice } = values;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();
      let sliceImageIpfsId: string | undefined;
   
      if (!slice.sliceImageIpfsId) {
         const { data: imageIpfsId } = await tryCatch(
            uploadImage(slice.sliceImageIpfsFile!),
         );

         sliceImageIpfsId = imageIpfsId as string;
      }
      
      return new Promise((res, rej) => {
         pinata.upload
            .json({
               ...slice,
               ...(!!sliceImageIpfsId && {
                  sliceImageIpfsId,
               })
            }, {
               metadata: {
                  name: `Slice-${slice.name}`,
               },
            })
            .key(keyData.JWT)
            .then(({ IpfsHash }) => {
               const sliceDetails = {
                  uniswapRouter: UNISWAP_ROUTER_ADDRESS,
                  usdc: USDC_ADDRESS,
                  name: slice.name,
                  symbol: slice.symbol,
                  metadataUri: IpfsHash,
               };

               writeContract({
                  contractId: ContractId.fromEvmAddress(0, 0, SLICE_FACTORY_ADDRESS),
                  abi: sliceFactoryAbi,
                  functionName: "deploySlice",
                  args: [uuid.v4(), sliceDetails],
               })
                  .then((tx) => {
                     watch(tx as string, {
                        onSuccess: (transaction) => {
                           res(transaction);

                           return transaction;
                        },
                        onError: (transaction, err) => {
                           rej(err);

                           return transaction;
                        },
                     });
                  })
                  .catch((err) => {
                     rej(err);
                  });
            });
      });
   };

   return {
      createSlice,
      waitForLastSliceDeployed,
      addTokenAssetsToSliceMutation,
      addRewardsIntoSliceMutation,
   };
}
