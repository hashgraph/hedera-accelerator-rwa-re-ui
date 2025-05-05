import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { vaultFactoryAbi } from "@/services/contracts/abi/vaultFactoryAbi";
import {
   AUTO_COMPOUNDER_FACTORY_ADDRESS,
   UNISWAP_ROUTER_ADDRESS,
   USDC_ADDRESS,
   VAULT_FACTORY_ADDRESS,
} from "@/services/contracts/addresses";
import type { DeployAutoCompounderRequest, DeployVaultRequest } from "@/types/erc3643/types";
import {
   useEvmAddress,
   useWatchTransactionReceipt,
   useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { ethers } from "ethers";
import * as uuid from "uuid";

export const useATokenDeployFlow = () => {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { data: evmAddress } = useEvmAddress();

   const handleDeployVault = async (data: DeployVaultRequest): Promise<string> => {
      return new Promise((res, rej) => {
         const salt = `0x${uuid.v4().replace(/-/g, "")}`;
         const details = {
            stakingToken: data.stakingToken,
            shareTokenName: data.shareTokenName,
            shareTokenSymbol: data.shareTokenSymbol,
            vaultRewardController: evmAddress,
            feeConfigController: evmAddress,
            cliff: 30,
            unlockDuration: 60,
         };
         const feeConfig = {
            receiver: data.feeReceiver || ethers.ZeroAddress,
            token: data.feeToken || ethers.ZeroAddress,
            feePercentage: data.feePercentage,
         };

         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, VAULT_FACTORY_ADDRESS),
            abi: vaultFactoryAbi,
            functionName: "deployVault",
            args: [salt, details, feeConfig],
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
   };

   const handleDeployAutoCompounder = async (
      data: DeployAutoCompounderRequest,
   ): Promise<string> => {
      return new Promise((res, rej) => {
         const salt = uuid.v4();
         const details = {
            uniswapV2Router: UNISWAP_ROUTER_ADDRESS,
            usdc: USDC_ADDRESS,
            vault: data.tokenAsset,
            aTokenName: data.tokenName,
            aTokenSymbol: data.tokenSymbol,
         };
         writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, AUTO_COMPOUNDER_FACTORY_ADDRESS),
            abi: autoCompounderFactoryAbi,
            functionName: "deployAutoCompounder",
            args: [salt, details],
         })
            .then((tx) => {
               watch(tx as string, {
                  onSuccess: (transaction) => {
                     res(transaction.transaction_id);

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
   };

   return {
      handleDeployAutoCompounder,
      handleDeployVault,
   };
};
