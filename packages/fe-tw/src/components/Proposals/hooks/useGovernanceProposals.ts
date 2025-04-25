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
import { ContractId } from "@hashgraph/sdk";
import { useState, useEffect } from "react";
import { tryCatch } from "@/services/tryCatch";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { getTokenBalanceOf, getTokenDecimals } from "@/services/erc20Service";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";

const DELEGATE_VOTE_AMOUNT = '1';

export const useGovernanceProposals = (buildingGovernanceAddress?: `0x${string}`, buildingToken?: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const { executeTransaction } = useExecuteTransaction();
    const { data: evmAddress } = useEvmAddress();
    const [governanceProposals, setGovernanceProposals] = useState<Proposal[]>([]);

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

        return new Promise((res, rej) => {
            writeContract({
                functionName,
                args: [proposalId],
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

    const createPaymentProposal = (proposalPayload: CreateProposalPayload): Promise<string> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

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
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

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

    const createChangeReserveProposal = async (proposalPayload: CreateProposalPayload): Promise<string | undefined> => {
        if (!buildingGovernanceAddress) {
            return Promise.reject('No governance deployed for a building');
        }

        return new Promise((res, rej) => {
            return writeContract({
                functionName: 'createChangeReserveProposal',
                args: [proposalPayload.amount, proposalPayload.description],
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
            return new Promise((res, rej) => {
                writeContract({
                    functionName: 'castVote',
                    args: [proposalId, choice],
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
        } else {
            throw new Error(error?.message);
        }
    };

    const watchProposals = () => {
        const proposalCreatedUnwatch = watchContractEvent({
            address: buildingGovernanceAddress as `0x${string}`,
            abi: buildingGovernanceAbi,
            eventName: 'ProposalCreated',
            onLogs: (proposalCreatedData) => {
                console.log('proposalCreatedData', proposalCreatedData);

                watchContractEvent({
                    address: buildingGovernanceAddress as `0x${string}`,
                    abi: buildingGovernanceAbi,
                    eventName: 'ProposalDefined',
                    onLogs: (proposalDefinedData) => {
                        console.log('proposalDefinedData', proposalDefinedData);
        
                        setGovernanceProposals(prev => prev.map(proposal => {
                            const proposalDefinedLog = proposalDefinedData.find(
                                proposalDefined => (proposalDefined as unknown as { args: any[] }).args[0] === proposal.id
                            );
        
                            if (!!proposalDefinedLog) {
                                return {
                                    ...proposal,
                                    amount: Number((proposalDefinedLog as unknown as { args: any[] }).args[4].toString()),
                                    to: (proposalDefinedLog as unknown as { args: any[] }).args[3],
                                    propType: (proposalDefinedLog as unknown as { args: any[] }).args[1].toString() as ProposalType,
                                };
                            }
        
                            return proposal;
                        }));
                    },
                });

                setGovernanceProposals(prev => [...prev, ...proposalCreatedData.filter((log) => !prev.find(proposal => proposal.id === (log as unknown as { args: any[] }).args[0])).map((log) => ({
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

        return { proposalCreatedUnwatch };
    };

    useEffect(() => {
        if (!!buildingGovernanceAddress) {
            const { proposalCreatedUnwatch } = watchProposals();

            return () => {
                proposalCreatedUnwatch();
            };
        }
    }, [buildingGovernanceAddress]);

    const { data: proposalDeadlines } = useQuery({
        queryKey: ["proposalDeadlines", governanceProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalDeadlinesData = await Promise.allSettled(governanceProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'proposalDeadline',
                args: [proposal.id],
            })));

            const proposalDeadlines: ProposalDeadlines = {};
    
            proposalDeadlinesData.forEach((deadline, stateId) => {
                proposalDeadlines[governanceProposals[stateId].id] =
                    new Date(Number((deadline as any).value[0].toString()) * 1000).toISOString();
            });

            return proposalDeadlines;
        },
        enabled: governanceProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    const { data: proposalStates } = useQuery({
        queryKey: ["proposalStates", governanceProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalStatesData = await Promise.allSettled(governanceProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'state',
                args: [proposal.id],
            })));

            const proposalStates: ProposalStates = {};
    
            proposalStatesData.forEach((state, stateId) => {
                proposalStates[governanceProposals[stateId].id] = (state as any).value[0].toString();
            });

            return proposalStates;
        },
        enabled: governanceProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    const { data: proposalVotes } = useQuery({
        queryKey: ["proposalVotes", governanceProposals.map(proposal => proposal.id?.toString())],
        queryFn: async () => {
            const proposalVotesResponse = await Promise.allSettled(governanceProposals.map(proposal => readContract({
                abi: buildingGovernanceAbi,
                address: buildingGovernanceAddress,
                functionName: 'proposalVotes',
                args: [proposal.id],
            })));

            const proposalVotes: ProposalVotes = {};
    
            proposalVotesResponse.forEach((vote, voteId) => {
                proposalVotes[governanceProposals[voteId].id] = {
                    no: Number(formatUnits((vote as any).value[0], 18)),
                    yes: Number(formatUnits((vote as any).value[1], 18)),
                };
            });

            return proposalVotes;
        },
        enabled: governanceProposals?.length > 0,
        initialData: {},
        refetchInterval: 10000,
    });

    return { createProposal, voteProposal, execProposal, proposalDeadlines, proposalStates, proposalVotes, governanceProposals };
};
