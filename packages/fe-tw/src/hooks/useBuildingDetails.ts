import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import type { QueryData } from "@/types/erc3643/types";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { useMemo, useState, useEffect, useCallback } from "react";
import { readContract } from "@/services/contracts/readContract";
import { getTokenDecimals } from "@/services/erc20Service";

export const getTokenName = async (
  tokenAddress: `0x${string}`,
): Promise<string> => {
  return await readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "name",
    args: [],
  });
};

const removeLogsDuplicates = (
  prevLogs: { args: `0x${string}`[] }[],
  currentLogs: { args: `0x${string}`[] }[],
) => {
  return [
    ...prevLogs.filter(prevLog => !currentLogs.find(log => log.args[1] === prevLog.args[1])),
    ...currentLogs,
  ];
};

export function useBuildingDetails(buildingAddress?: `0x${string}`) {
  const [buildingOwner, setBuildingOwner] = useState<`0x${string}`>();
  const [deployedBuildingTokens, setDeployedBuildingTokens] = useState<
    { tokenAddress: `0x${string}`; buildingAddress: `0x${string}` }[]
  >([]);
  const [newTokenForBuildingLogs, setNewTokenForBuildingLogs] = useState<
    { args: `0x${string}`[] }[]
    >([]);
  const [tokenDecimals, setTokenDecimals] = useState<number[]>([]);
  const { data: evmAddress } = useEvmAddress();
  const [tokenNames, setTokenNames] = useState<{
    [key: `0x${string}`]: string;
  }>({});

    const fetchBuildingTokenDecimals = async () => {
      if (deployedBuildingTokens?.length) {
        const tokenDecimals = await Promise.all(deployedBuildingTokens?.map(tok => getTokenDecimals(tok.tokenAddress)));
  
        setTokenDecimals(tokenDecimals.map(decimals => (decimals as any)[0]));
      }
    };
  
  const fetchTokenNames = useCallback(async () => {
    deployedBuildingTokens.forEach((tok) => {
      getTokenName(tok.tokenAddress).then((tokenName) => {
        setTokenNames((prev) => ({
          ...prev,
          [tok.tokenAddress]: tokenName[0],
        }));
      });
    });
  }, [deployedBuildingTokens, setTokenNames]);

  useEffect(() => {
    watchContractEvent({
      address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
      abi: buildingAbi,
      eventName: "OwnershipTransferred",
      onLogs: (data) => {
        const owner = (data[0] as unknown as QueryData<`0x${string}`[]>)
          ?.args?.[1];

        setBuildingOwner(owner);
      },
    });

    watchContractEvent({
      address: BUILDING_FACTORY_ADDRESS,
      abi: buildingFactoryAbi,
      eventName: "NewERC3643Token",
      onLogs: (data) => {
        setNewTokenForBuildingLogs((prev) => {
          return removeLogsDuplicates(
            (prev as unknown as { args: `0x${string}`[] }[]),
            (data as unknown as { args: `0x${string}`[] }[])
          )
        })
      },
    });
  }, []);

  useEffect(() => {
    setDeployedBuildingTokens(
      newTokenForBuildingLogs
        .map((log) => ({
          tokenAddress: log.args[1],
          buildingAddress: log.args[0],
        }))
        .filter((log) => log.buildingAddress === buildingAddress),
    );
  }, [newTokenForBuildingLogs?.length, buildingAddress]);

  useEffect(() => {
    if (deployedBuildingTokens?.length) {
      fetchTokenNames();
      fetchBuildingTokenDecimals();
    }
  }, [deployedBuildingTokens]);

  const isBuildingAdmin = useMemo(() => {
    if (!!buildingOwner) {
      return buildingOwner === evmAddress;
    }

    return false;
  }, [buildingOwner]);

  return { isBuildingAdmin, deployedBuildingTokens, tokenDecimals, tokenNames };
}
