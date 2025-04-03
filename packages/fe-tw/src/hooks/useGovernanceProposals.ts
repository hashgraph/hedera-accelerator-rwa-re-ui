import { buildingGovernanceAbi } from "@/services/contracts/abi/buildingGovernanceAbi";
import { CreateProposalPayload } from "@/types/erc3643/types";
import { ProposalType } from "@/types/props";
import {
	useWriteContract,
    useWatchTransactionReceipt
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";

export const useGovernanceProposals = (buildingGovernanceAddress: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    
    const createPaymentProposal = (proposalPayload: CreateProposalPayload): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                functionName: 'createPaymentProposal',
                args: [proposalPayload.amount, proposalPayload.to, proposalPayload.description],
                abi: buildingGovernanceAbi,
                contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
            }).then((tx) => {
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
            });
        });
    };

    const createTextProposal = (proposalPayload: CreateProposalPayload): Promise<string> => {
        return new Promise((res, rej) => {
            return writeContract({
                functionName: 'createTextProposal',
                args: [0, proposalPayload.description],
                abi: buildingGovernanceAbi,
                contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
            }).then((tx) => {
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
            });
        });
    };

    const createProposal = async (proposalPayload: CreateProposalPayload): Promise<string | undefined> => {
        if (proposalPayload.type === ProposalType.PaymentProposal) {
            return await createPaymentProposal(proposalPayload);
        } else if (proposalPayload.type === ProposalType.TextProposal) {
            return await createTextProposal(proposalPayload);
        }
    };

    return { createProposal };
};
