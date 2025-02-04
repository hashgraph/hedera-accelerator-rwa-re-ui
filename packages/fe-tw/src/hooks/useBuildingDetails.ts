import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { buildingFactoryAddress } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BuildingData, QueryData } from "@/types/erc3643/types";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { useMemo, useState, useEffect } from "react";

export function useBuildingDetails(building: BuildingData) {
    const [buildingOwner, setBuildingOwner] = useState<`0x${string}`>();
    const [deployedBuildingTokens, setDeployedBuildingTokens] = useState<{ tokenAddress: `0x${string}`, buildingAddress: `0x${string}` }[]>([]);
    const [newTokenForBuildingLogs, setNewTokenForBuildingLogs] = useState<{ args: `0x${string}`[] }[]>([]);
    const { data: evmAddress } = useEvmAddress();

    watchContractEvent({
        address: building?.address as `0x${string}`,
        abi: buildingAbi,
        eventName: 'OwnershipTransferred',
        onLogs: (data) => {
            const owner = (data[0] as unknown as QueryData<`0x${string}`[]>)?.args?.[1];

            setBuildingOwner(owner);
        },
    });

    watchContractEvent({
        address: buildingFactoryAddress,
        abi: buildingFactoryAbi,
        eventName: "NewERC3643Token",
        onLogs: (data) => {
            setNewTokenForBuildingLogs(prev => !prev.length ? data as unknown as { args: `0x${string}`[] }[] : prev);
        },
    });

    useEffect(() => {
        console.log('newTokenForBuildingLogs--', newTokenForBuildingLogs)

        setDeployedBuildingTokens(newTokenForBuildingLogs.map(log => ({
            tokenAddress: log.args[1],
            buildingAddress: log.args[0],
        })).filter((log) => log.buildingAddress === building.address));
    }, [newTokenForBuildingLogs?.length]);

    console.log('deployedBuildingTokens--', deployedBuildingTokens)

    const isBuildingAdmin = useMemo(() => {
        if (!!buildingOwner) {
            return buildingOwner === evmAddress;
        }

        return false;
    }, [buildingOwner]);

    return { isBuildingAdmin, deployedBuildingTokens };
}
