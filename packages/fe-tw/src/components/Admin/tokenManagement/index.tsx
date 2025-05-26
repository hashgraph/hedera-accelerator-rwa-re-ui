"use client";

import { DeployBuildingERC3643TokenForm } from "@/components/Admin/tokenManagement/DeployBuildingERC3643TokenForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TokenManagementView() {
   const [currentSetupStep, _] = useState(1);
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();
   const { push } = useRouter();
   
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Description */}
            <div className="bg-purple-50 p-6 rounded-lg">
               <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
               <p className="text-sm sm:text-base text-gray-700">
                  This interface allows you to deploy ERC-3643 compliant tokens.
               </p>
               <p className="mt-4 text-sm sm:text-base text-gray-700">
                  To deploy a token, fill in the form with the token name, symbol, and decimal
                  places. Once submitted, the token will be deployed on Hedera, and you'll receive
                  the token address.
               </p>
            </div>

            {/* Right Column: Token Deployment Form */}
            <div>
               <h1 className="text-2xl font-bold mb-4">
                  {currentSetupStep === 1 ? "Deploy ERC3643(USDC) Token" : "Add Token Liquidity"}
               </h1>
               <DeployBuildingERC3643TokenForm
                     buildingAddress={selectedBuildingAddress}
                     setSelectedBuildingAddress={(addr) => {
                        setSelectedBuildingAddress(addr);
                     }}
                     handleGoAddLiquidity={() => {
                        push(`/building/${selectedBuildingAddress}/liquidity`);
                     }}
                  />
            </div>
         </div>
      </div>
   );
}
