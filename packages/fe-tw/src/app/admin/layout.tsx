"use client";

import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import {
   MetamaskConnector,
   HashpackConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   const { isConnected: isMetamaskConnected } = useWallet(MetamaskConnector);
   const { isConnected: isHashpackConnected } = useWallet(HashpackConnector);

   return (
      <div className="flex min-h-screen bg-white">
         <AdminSidebar />

         <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
            {isMetamaskConnected || isHashpackConnected ? (
               children
            ) : (
               <h1 className="text-1xl font-bold tracking-tight">
                  Wallet not connected. Please connect to continue.
               </h1>
            )}
         </main>
      </div>
   );
}
