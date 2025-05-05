import { buildingGovernanceAbi } from "@/services/contracts/abi/buildingGovernanceAbi";
import { CreateProposalPayload } from "@/types/erc3643/types";
import { Proposal, ProposalDeadlines, ProposalStates, ProposalType, ProposalVotes } from "@/types/props";
import {
	useWriteContract,
    useWatchTransactionReceipt,
    useEvmAddress,
} from "@buidlerlabs/hashgraph-react-wallets";
import { formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "@/services/contracts/readContract";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { ContractId, TransactionReceipt } from "@hashgraph/sdk";
import { useState, useEffect } from "react";
import { tryCatch } from "@/services/tryCatch";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { getTokenBalanceOf, getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";

const DELEGATE_VOTE_AMOUNT = '1';

export const useGovernanceProposals = (buildingGovernanceAddress?: `0x${string}`, buildingToken?: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { executeTransaction } = useExecuteTransaction();
    const { data: evmAddress } = useEvmAddress();
    const [governanceCreatedProposals, setGovernanceCreatedProposals] = useState<Proposal[]>([]);
    const [governanceDefinedProposals, setGovernanceDefinedProposals] = useState<any[]>([]);

    const execProposal = async (proposalId: number, proposalType: ProposalType): Promise<string | undefined> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        let functionName = 'executeTextProposal';

        if (proposalType === ProposalType.ChangeReserveProposal) {
            functionName = 'executeChangeReserveProposal';
        } else if (proposalType === ProposalType.PaymentProposal) {
            functionName = 'executePaymentProposal';
        }

        const tx = await executeTransaction(() => writeContract({
            functionName,
            args: [proposalId],
            abi: buildingGovernanceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
        })) as { transaction_id: string };

        return tx?.transaction_id;
    };

    const mintAndDelegate = async () => {
        const { data: tokenDecimals, error: tokenDecimalsError } = await tryCatch(getTokenDecimals(buildingToken!));
        const { data: tokenBalance, error: tokenBalanceError } = await tryCatch(getTokenBalanceOf(buildingToken!, evmAddress));
        const tokenBalanceInEthers = parseFloat(formatUnits(tokenBalance, Number((tokenDecimals as any)[0])));

        if (tokenDecimalsError || tokenBalanceError) {
            throw new Error('Fetch decimals or token balance error');
        }

        if (tokenBalanceInEthers < Number(DELEGATE_VOTE_AMOUNT)) {
            const { data: mintTx, error: mintTxError } = await tryCatch(writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingToken as string),
                abi: tokenAbi,
                functionName: "mint",
                args: [evmAddress, BigInt(Math.floor(Number.parseFloat(DELEGATE_VOTE_AMOUNT) * 10 ** Number((tokenDecimals as any)[0])))],
            }));
            const { data: delegateTx, error: delegateTxError } = await tryCatch(writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingToken as string),
                abi: tokenAbi,
                functionName: "delegate",
                args: [evmAddress],
            }));

            if (delegateTx || mintTx) {
                return { data: delegateTx || mintTx };
            } else {
                return { error: delegateTxError || mintTxError };
            }
        } else {
            const { data: delegateTx, error: delegateTxError } = await tryCatch(writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingToken as string),
                abi: tokenAbi,
                functionName: "delegate",
                args: [evmAddress],
            }));

            if (delegateTx) {
                return { data: delegateTx };
            } else {
                return { error: delegateTxError };
            }
        }
    };

    const createPaymentProposal = async (proposalPayload: CreateProposalPayload): Promise<string> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        const tx = await executeTransaction(() => writeContract({
            functionName: 'createPaymentProposal',
            args: [proposalPayload.amount, proposalPayload.to, proposalPayload.description],
            abi: buildingGovernanceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
        })) as { transaction_id: string };

        return tx?.transaction_id;
    };

    const createTextProposal = async (proposalPayload: CreateProposalPayload): Promise<string> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        const tx = await executeTransaction(() => writeContract({
            functionName: 'createTextProposal',
            args: [0, proposalPayload.description],
            abi: buildingGovernanceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
        })) as { transaction_id: string };

        return tx?.transaction_id;
    };

    const createChangeReserveProposal = async (proposalPayload: CreateProposalPayload): Promise<string | undefined> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        const tx = await executeTransaction(() => writeContract({
            functionName: 'createChangeReserveProposal',
            args: [proposalPayload.amount, proposalPayload.description],
            abi: buildingGovernanceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
        })) as { transaction_id: string };

        return tx?.transaction_id;
    };

    const createProposal = async (proposalPayload: CreateProposalPayload): Promise<string | undefined> => {
        const { data, error } = await mintAndDelegate();
        
        if (data) {
            if (proposalPayload.type === ProposalType.PaymentProposal) {
                return await createPaymentProposal(proposalPayload);
            } else if (proposalPayload.type === ProposalType.TextProposal) {
                return await createTextProposal(proposalPayload);
            } else if (proposalPayload.type === ProposalType.ChangeReserveProposal) {
                return await createChangeReserveProposal(proposalPayload);
            }
        } else {
            throw new Error(error?.message);
        }
    };

    const voteProposal = async (proposalId: number, choice: 1 | 0): Promise<string | undefined> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        const { data, error } = await mintAndDelegate();

        if (data) {
            const tx = await executeTransaction(() => writeContract({
                functionName: 'castVote',
                args: [proposalId, choice],
                abi: buildingGovernanceAbi,
                contractId: ContractId.fromEvmAddress(0, 0, buildingGovernanceAddress),
            })) as { transaction_id: string };

            return tx?.transaction_id;
        } else {
            throw new Error(error?.message);
        }
    };

    const watchCreatedProposals = () => {
        return watchContractEvent({
            address: buildingGovernanceAddress as `0x${string}`,
            abi: buildingGovernanceAbi,
            eventName: 'ProposalCreated',
            onLogs: (proposalCreatedData) => {
                setGovernanceCreatedProposals(prev => [...prev, ...proposalCreatedData.filter((log) => !prev.find(proposal => proposal.id === (log as unknown as { args: any[] }).args[0])).map((log) => ({
                    id: (log as unknown as { args: any[] }).args[0],
                    description: (log as unknown as { args: any[] }).args[8],
                    started: Number((log as unknown as { args: any[] }).args[6].toString()),
                    expiry: Number((log as unknown as { args: any[] }).args[7].toString()),
                    to: undefined,
                    amount: undefined,
                    propType: undefined,
                }))]);
            },
        });
    };

    const watchDefinedProposals = () => {
        return watchContractEvent({
            address: buildingGovernanceAddress as `0x${string}`,
            abi: buildingGovernanceAbi,
            eventName: 'ProposalDefined',
            onLogs: (proposalDefinedData) => {
                setGovernanceDefinedProposals(prev => [...prev, ...proposalDefinedData.filter((log) => !prev.find(proposal => proposal.id === (log as unknown as { args: any[] }).args[0])).map((log) => ({
                    amount: Number((log as unknown as { args: any[] }).args[4].toString()),
                    to: (log as unknown as { args: any[] }).args[3],
                    propType: (log as unknown as { args: any[] }).args[1].toString() as ProposalType,
                    id: (log as unknown as { args: any[] }).args[0],
                }))]);
            },
        });
    };

    useEffect(() => {
        if (!!buildingGovernanceAddress) {
            const unwatch_1 = watchCreatedProposals();
            const unwatch_2 = watchDefinedProposals();

            return () => {
                unwatch_1();
                unwatch_2();
            };
        }
    }, [buildingGovernanceAddress]);

    const { data: proposalDeadlines } = useQuery({
        queryKey: ["proposalDeadlines", governanceCreatedProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalDeadlinesData = await Promise.allSettled(governanceCreatedProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'proposalDeadline',
                args: [proposal.id],
            })));

            const proposalDeadlines: ProposalDeadlines = {};
    
            proposalDeadlinesData.forEach((deadline, stateId) => {
                proposalDeadlines[governanceCreatedProposals[stateId].id] =
                    new Date(Number((deadline as any).value[0].toString()) * 1000).toISOString();
            });

            return proposalDeadlines;
        },
        enabled: governanceCreatedProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    const { data: proposalStates } = useQuery({
        queryKey: ["proposalStates", governanceCreatedProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalStatesData = await Promise.allSettled(governanceCreatedProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'state',
                args: [proposal.id],
            })));

            const proposalStates: ProposalStates = {};
    
            proposalStatesData.forEach((state, stateId) => {
                proposalStates[governanceCreatedProposals[stateId].id] = (state as any).value[0].toString();
            });

            return proposalStates;
        },
        enabled: governanceCreatedProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    const { data: proposalVotes } = useQuery({
        queryKey: ["proposalVotes", governanceCreatedProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalVotesResponse = await Promise.allSettled(governanceCreatedProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'proposalVotes',
                args: [proposal.id],
            })));

            const proposalVotes: ProposalVotes = {};
    
            proposalVotesResponse.forEach((vote, voteId) => {
                proposalVotes[governanceCreatedProposals[voteId].id] = {
                    no: Number(formatUnits((vote as any).value[0], 18)),
                    yes: Number(formatUnits((vote as any).value[1], 18)),
                };
            });

            return proposalVotes;
        },
        enabled: governanceCreatedProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    return {
        createProposal,
        voteProposal,
        execProposal,
        proposalDeadlines,
        proposalStates,
        proposalVotes,
        governanceCreatedProposals,
        governanceDefinedProposals,
    };
};
