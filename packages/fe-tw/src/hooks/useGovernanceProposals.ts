import { buildingGovernanceAbi } from "@/services/contracts/abi/buildingGovernanceAbi";
import { CreateProposalPayload } from "@/types/erc3643/types";
import { Proposal, ProposalState, ProposalStates, ProposalType, ProposalVotes } from "@/types/props";
import {
	useWriteContract,
    useWatchTransactionReceipt,
    useEvmAddress,
} from "@buidlerlabs/hashgraph-react-wallets";
import { formatUnits } from "viem";
import { readContract } from "@/services/contracts/readContract";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { ContractId } from "@hashgraph/sdk";
import { useState, useEffect } from "react";
import { tryCatch } from "@/services/tryCatch";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { getTokenBalanceOf, getTokenDecimals } from "@/services/erc20Service";

const DELEGATE_VOTE_AMOUNT = '1';

const convertProposalType = (value: string) => {
    if (value === '0') {
        return ProposalType.TextProposal;
    } else if (value === '1') {
        return ProposalType.PaymentProposal;
    } else if (value === '2') {
        return ProposalType.ChangeReserveProposal;
    }
};
  
const convertProposalState = (value: string) => {
    if (value === '0') {
        return ProposalState.PendingProposal;
    } else if (value === '1') {
        return ProposalState.ActiveProposal;
    } else if (value === '2') {
        return ProposalState.CanceledProposal;
    } else if (value === '3') {
        return ProposalState.DefeatedProposal;
    } else if (value === '4') {
        return ProposalState.SucceededProposal;
    } else if (value === '5') {
        return ProposalState.QueuedProposal;
    } else if (value === '6') {
        return ProposalState.ExpiredProposal;
    } else if (value === '7') {
        return ProposalState.ExecutedProposal;
    }
};

export const useGovernanceProposals = (buildingGovernanceAddress?: `0x${string}`, buildingToken?: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const { data: evmAddress } = useEvmAddress();
    const [governanceProposals, setGovernanceProposals] = useState<Proposal[]>([]);
    const [proposalVotes, setProposalVotes] = useState<ProposalVotes>({});
    const [proposalStates, setProposalStates] = useState<ProposalStates>({});
    const [proposalWatcher, setProposalWatcher] = useState<any>();

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
                        getProposalStates();
                        
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
        const tokenDecimals = await getTokenDecimals(buildingToken!);
        const tokenBalance = await getTokenBalanceOf(buildingToken!, evmAddress);
        const tokenBalanceInEthers = parseFloat(formatUnits(tokenBalance, Number(tokenDecimals.toString())));

        if (tokenBalanceInEthers < Number(DELEGATE_VOTE_AMOUNT)) {
            const { data: mintTx, error: mintTxError } = await tryCatch(writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingToken as string),
                abi: tokenAbi,
                functionName: "mint",
                args: [evmAddress, BigInt(Math.floor(Number.parseFloat(DELEGATE_VOTE_AMOUNT) * 10 ** tokenDecimals))],
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

    const getProposalStates = async () => {
        const proposalStates = await Promise.all(governanceProposals.map(proposal => readContract({
            abi: buildingGovernanceAbi,
            address: buildingGovernanceAddress,
            functionName: 'state',
            args: [proposal.id],
        })));

        proposalStates.forEach((state, stateId) => {
            setProposalStates(prev => ({
                ...prev,
                [governanceProposals[stateId].id]: convertProposalState(state[0].toString()),
            }));
        });
    };

    const getProposalVotes = async () => {
        const proposalVotes = await Promise.all(governanceProposals.map(proposal => readContract({
            abi: buildingGovernanceAbi,
            address: buildingGovernanceAddress,
            functionName: 'proposalVotes',
            args: [proposal.id],
        })));

        proposalVotes.forEach((vote, voteId) => {
            setProposalVotes(prev => ({
                ...prev,
                [governanceProposals[voteId].id]: {
                    no: formatUnits(vote[0], 18),
                    yes: formatUnits(vote[1], 18),
                }
            }));
        });
    };

    const watchProposals = () => {
        watchContractEvent({
            address: buildingGovernanceAddress as `0x${string}`,
            abi: buildingGovernanceAbi,
            eventName: 'ProposalCreated',
            onLogs: (proposalCreatedData) => {
                setGovernanceProposals(prev => [...prev, ...proposalCreatedData.filter((log) => !prev.find(proposal => proposal.id === (log as unknown as { args: any[] }).args[0])).map((log) => ({
                    id: (log as unknown as { args: any[] }).args[0],
                    description: (log as unknown as { args: any[] }).args[8],
                    started: Number((log as unknown as { args: any[] }).args[6].toString()),
                    expiry: Number((log as unknown as { args: any[] }).args[7].toString()),
                    to: undefined,
                    amount: undefined,
                    propType: undefined,
                }))]);

                watchContractEvent({
                    address: buildingGovernanceAddress as `0x${string}`,
                    abi: buildingGovernanceAbi,
                    eventName: 'ProposalDefined',
                    onLogs: (proposalDefinedData) => {
                        setGovernanceProposals(prev => prev.map(proposal => {
                            const proposalDefinedLog = proposalDefinedData.find(
                                proposalDefined => (proposalDefined as unknown as { args: any[] }).args[0] === proposal.id
                            );

                            if (!!proposalDefinedLog) {
                                return {
                                    ...proposal,
                                    amount: Number((proposalDefinedLog as unknown as { args: any[] }).args[4].toString()),
                                    to: (proposalDefinedLog as unknown as { args: any[] }).args[3],
                                    propType: convertProposalType((proposalDefinedLog as unknown as { args: any[] }).args[1].toString()) as ProposalType,
                                };
                            }

                            return proposal;
                        }));
                    },
                });
            },
        });
    };

    useEffect(() => {
        if (!!buildingGovernanceAddress) {
            watchProposals();
        }
    }, [buildingGovernanceAddress]);

    useEffect(() => {
        if (governanceProposals?.length) {
            setProposalWatcher((prev: any) => {
                if (prev) {
                    clearInterval(prev);
                }

                return setInterval(() => {
                    getProposalVotes();
                    getProposalStates();
                }, 10000);
            });
        }
    }, [governanceProposals]);

    return { createProposal, voteProposal, execProposal, proposalStates, proposalVotes, governanceProposals };
};
