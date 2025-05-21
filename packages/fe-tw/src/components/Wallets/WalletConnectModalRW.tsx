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
import { tryCatch } from "@/services/tryCatch";

export function WalletConnectModalRW() {
   const [isModalOpen, setModalOpen] = useState(false);

   const { connect: connectHashpack } = useWallet(HashpackConnector) || {};

   const { connect: connectMetamask } = useWallet(MetamaskConnector) || {};

   const handleConnectHashpack = async () => {
      const { data, error } = await tryCatch(connectHashpack());
      if (error) {
         console.log("error :>> ", error);
      }
      setModalOpen(false);
   };

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
                     <Button variant="outline" onClick={handleConnectHashpack}>
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
                           connectMetamask();
                           setModalOpen(false);
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
