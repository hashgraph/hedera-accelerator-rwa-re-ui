"use client";

import { trexGatewayAbi } from "@/services/contracts/abi/trexGatewayAbi";
import { TREX_GATEWAY_ADDRESS } from "@/services/contracts/addresses";
import { useWalletInterface } from "@/services/useWalletInterface";
import type { EvmAddress } from "@/types/common";
import type { DeployTokenRequest } from "@/types/erc3643/types";
import { ContractId } from "@hashgraph/sdk";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

export function useDeployToken() {
   const { accountEvmAddress, walletInterface } = useWalletInterface();

   return useMutation({
      mutationFn: async ({
         name,
         symbol,
         decimals,
         complianceModules,
         complianceSettings,
      }: DeployTokenRequest) => {
         const currentDeployerAddress = accountEvmAddress as EvmAddress;

         //@TODO pass from outside
         name = "token_deploy_new_1";
         symbol = "tkn_dep_new_1";
         decimals = 8;
         complianceModules = [];
         complianceSettings = [];

         const tokenDetails = {
            owner: currentDeployerAddress,
            name,
            symbol,
            decimals,
            irs: ethers.ZeroAddress as EvmAddress, // IdentityRegistryStorage
            ONCHAINID: ethers.ZeroAddress as EvmAddress, // Identity for the token
            irAgents: [currentDeployerAddress],
            tokenAgents: [currentDeployerAddress],
            complianceModules,
            complianceSettings,
         };

         // claims are not needed right now
         const claims = {
            topics: [],
            issuers: [],
            issuerClaims: [],
         };

         const claimsDetails = {
            claimTopics: claims.topics,
            issuers: claims.issuers,
            issuerClaims: claims.issuerClaims,
         };

         const deployResult = await walletInterface?.executeContractFunction(
            ContractId.fromEvmAddress(0, 0, TREX_GATEWAY_ADDRESS),
            trexGatewayAbi,
            "deployTREXSuite",
            [tokenDetails, claimsDetails],
         );

         return deployResult;
      },
   });
}
