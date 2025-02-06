import { ContractId, TransactionReceipt } from "@hashgraph/sdk";
import { readContract } from "@/services/contracts/readContract";
import { auditRegistryAbi } from "@/services/contracts/abi/auditRegistryAbi";
import { AUDIT_REGISTRY_ADDRESS } from "@/services/contracts/addresses";

type WriteContractFn = (params: {
  contractId: ContractId | string;
  abi: any;
  functionName: string;
  args: any[];
  metaArgs?: {
    gas?: number;
    amount?: number;
  };
}) => Promise<string | TransactionReceipt | null>;

export async function getAuditRecordIdsForBuilding(buildingId: number): Promise<bigint[]> {
  const recordIds = (await readContract({
    address: AUDIT_REGISTRY_ADDRESS as `0x${string}`,
    abi: auditRegistryAbi,
    functionName: "getAuditRecordsByBuilding",
    args: [BigInt(buildingId)],
  })) as bigint[];
  return recordIds;
}

export async function addAuditRecord(
  writeContract: WriteContractFn,
  buildingId: number,
  ipfsHash: string
) {
  return writeContract({
    contractId: ContractId.fromSolidityAddress(
      AUDIT_REGISTRY_ADDRESS as `0x${string}`
    ),
    abi: auditRegistryAbi,
    functionName: "addAuditRecord",
    args: [BigInt(buildingId), ipfsHash],
    metaArgs: {
      gas: 250000,
    },
  });
}

export async function updateAuditRecord(
  writeContract: WriteContractFn,
  auditRecordId: number,
  ipfsHash: string
) {
  return writeContract({
    contractId: ContractId.fromSolidityAddress(
      AUDIT_REGISTRY_ADDRESS as `0x${string}`
    ),
    abi: auditRegistryAbi,
    functionName: "updateAuditRecord",
    args: [BigInt(auditRecordId), ipfsHash],
    metaArgs: {
      gas: 250000,
    },
  });
}
