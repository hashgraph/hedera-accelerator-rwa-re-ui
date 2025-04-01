import {
	useWriteContract,
    useWatchTransactionReceipt
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { GovernancePayload, TreasuryPayload } from "@/types/erc3643/types";

export const useGovernanceAndTreasuryDeployment = (buildingAddress?: `0x${string}`, buildingTokenAddress?: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const [treasuryAddress, setTreasuryAddress] = useState<`0x${string}`>();
    const [governanceAddress, setGovernanceAddress] = useState<`0x${string}`>();

    useEffect(() => {
        watchContractEvent({
            address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
            abi: buildingFactoryAbi,
            eventName: 'NewGovernance',
            onLogs: (data) => {
                const buildingGovernance: any = data.find((log: any) => log.args[1] === buildingAddress);

                if (buildingGovernance) {
                    setGovernanceAddress(buildingGovernance.args[0]);
                }
            },
        });

        watchContractEvent({
            address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
            abi: buildingFactoryAbi,
            eventName: 'NewTreasury',
            onLogs: (data) => {
                const buildingTreasury: any = data.find((log: any) => log.args[1] === buildingAddress);

                if (buildingTreasury) {
                    setTreasuryAddress(buildingTreasury.args[0]);
                }
            },
        });
    }, []);
    
    const deployBuildingGovernance = ({ governanceName }: GovernancePayload): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
                abi: buildingFactoryAbi,
                functionName: "newGovernance",
                args: [buildingAddress, governanceName, buildingTokenAddress, treasuryAddress],
            }).then((tx) => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id);
                        toast.success(`Governance added for building ${buildingAddress}`);
                        
                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err);
            
                        return transaction;
                    },
                });
            }).catch((err) => {
                rej(err);
            });
        });
    };

    const deployBuildingTreasury = ({ reserve, npercentage }: TreasuryPayload): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
                abi: buildingFactoryAbi,
                functionName: "newTreasury",
                args: [buildingAddress, buildingTokenAddress, parseInt(reserve, 10), parseInt(npercentage, 10)],
            }).then((tx) => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id);
                        toast.success(`Treasury added for building ${buildingAddress}`);

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err);
            
                        return transaction;
                    },
                });
            }).catch((err) => {
                rej(err);
            });
        });
    };

    return { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress, governanceAddress };
};
