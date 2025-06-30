import { trexFactoryAbi } from "@/services/contracts/abi/trexFactoryAbi";
import { TREX_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { EvmAddress } from "@/types/common";
import { useEffect, useState } from "react";

export function useWatchTrexFactoryTrexSuiteDeployedEvent() {
   const [deployedTokens, setDeployedTokens] = useState<EvmAddress[]>([]);

   useEffect(() => {
      const unsubscribe = watchContractEvent({
         abi: trexFactoryAbi,
         address: TREX_FACTORY_ADDRESS,
         eventName: "TREXSuiteDeployed",
         onLogs: (data) => {
            setDeployedTokens((prev) => {
               return [
                  ...prev,
                  ...data
                     .map(({ args }) => args._token)
                     .filter((token): token is EvmAddress => token !== undefined),
               ];
            });
         },
      });

      return () => {
         unsubscribe();
      };
   }, []);

   return { deployedTokens };
}
