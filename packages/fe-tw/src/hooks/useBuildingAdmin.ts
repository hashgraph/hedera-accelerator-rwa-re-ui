import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { CreateERC3643RequestBody } from "@/types/erc3643/types";
import { ContractId } from "@hashgraph/sdk";
import useWriteContract from "./useWriteContract";

export const useBuildingAdmin = (buildingAddress: `0x${string}`) => {
   const { writeContract } = useWriteContract();

   const createBuildingERC3643Token = (payload: CreateERC3643RequestBody) => () =>
      writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newERC3643Token",
         args: [buildingAddress, payload.tokenName, payload.tokenSymbol, payload.tokenDecimals],
      });

   return { createBuildingERC3643Token };
};
