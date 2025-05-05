import { shortEvmAddress } from "@/services/util";
import { useAccountId, useEvmAddress, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import {
   HashpackConnector,
   MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Unplug, UserCircle, Wallet } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";

export function WalletConnectModalRW() {
   const [isModalOpen, setModalOpen] = useState(false);

   const {
      isExtensionRequired: isExtensionRequiredHashpack,
      extensionReady: extensionReadyHashpack,
      isConnected: isConnectedHashpack,
      connect: connectHashpack,
      disconnect: disconectHashpack,
   } = useWallet(HashpackConnector) || {};

   const {
      isExtensionRequired: isExtensionRequiredMetamask,
      extensionReady: extensionReadyMetamask,
      isConnected: isConnectedMetamask,
      connect: connectMetamask,
      disconnect: disconnectMetamask,
   } = useWallet(MetamaskConnector) || {};

   return (
      <>
         <Dialog open={isModalOpen} onOpenChange={(state) => setModalOpen(state)}>
            <Button color={"primary"} onClick={() => setModalOpen(true)}>
               <Wallet />
               Connect Wallet
            </Button>
            <DialogContent className="">
               <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription className="flex flex-col gap-2 mt-4">
                     Choose a wallet to connect
                     <Button
                        variant="outline"
                        onClick={() => {
                           if (isExtensionRequiredHashpack && !extensionReadyHashpack) {
                              toast.error(
                                 "An error occurred while connecting to Haspack. Please ensure that Metamask is installed and unlocked.",
                              );
                           } else {
                              connectHashpack();
                              setModalOpen(false);
                           }
                        }}
                     >
                        <Image
                           alt="hashpack icon"
                           src="/assets/hashpack-icon.png"
                           width={24}
                           height={24}
                        />
                        Hashpack
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => {
                           if (isExtensionRequiredMetamask && !extensionReadyMetamask) {
                              toast.error(
                                 "An error occurred while connecting to Metamask. Please ensure that Metamask is installed and unlocked.",
                              );
                           } else {
                              connectMetamask();
                              setModalOpen(false);
                           }
                        }}
                     >
                        <Image
                           alt="metamask icon"
                           src="/assets/metamask-icon.png"
                           width={32}
                           height={32}
                        />
                        Metamask
                     </Button>
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </>
   );
}
