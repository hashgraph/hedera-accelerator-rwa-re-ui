import { auditRegistryAbi } from "@/services/contracts/abi/auditRegistryAbi";
import { AUDIT_REGISTRY_ADDRESS } from "@/services/contracts/addresses";
import type { WalletInterface } from "@/services/wallets/WalletInterface"; // <-- use this type
import { ContractId } from "@hashgraph/sdk";
import { readContract } from "@/services/contracts/readContract";

export async function getAuditRecordIdsForBuilding(buildingId: number): Promise<bigint[]> {
  const recordIds = (await readContract({
    address: AUDIT_REGISTRY_ADDRESS as `0x${string}`,
    abi: auditRegistryAbi,
    functionName: "getAuditRecordsByBuilding",
    args: [BigInt(buildingId)]
  })) as bigint[];
  return recordIds;
}

export async function addAuditRecord(
  wallet: WalletInterface, 
  buildingId: number,
  ipfsHash: string
) {
  return wallet.executeContractFunction(
    ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
    auditRegistryAbi,
    "addAuditRecord",
    [BigInt(buildingId), ipfsHash]
  );
}

export async function updateAuditRecord(
  wallet: WalletInterface, 
  auditRecordId: number,
  ipfsHash: string
) {
  return wallet.executeContractFunction(
    ContractId.fromEvmAddress(0, 0, AUDIT_REGISTRY_ADDRESS),
    auditRegistryAbi,
    "updateAuditRecord",
    [BigInt(auditRecordId), ipfsHash]
  );
}
