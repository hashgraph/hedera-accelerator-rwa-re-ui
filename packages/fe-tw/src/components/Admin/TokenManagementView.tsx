"use client";

import { useState, useMemo } from "react";
import { DeployBuildingERC3643TokenForm } from "@/components/Admin/DeployBuildingERC3643TokenForm";
import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";

export function TokenManagementView() {
  const [currentSetupStep, setCurrentSetupStep] = useState(1);
  const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>('0x');

  const renderSetupStepView = useMemo(() => {
    if (currentSetupStep === 1) {
      return (
        <DeployBuildingERC3643TokenForm onGetLiquidityView={(address) => {
          setCurrentSetupStep(2);
          setSelectedBuildingAddress(address);
        }} />
      )
    } else if (currentSetupStep === 2) {
      return (
        <AddBuildingTokenLiquidityForm
          buildingAddress={selectedBuildingAddress}
          onGetDeployBuildingTokenView={() => {
            setCurrentSetupStep(2);
          }}
        />
      )
    }
  }, [currentSetupStep]);

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
            To deploy a token, fill in the form with the token name, symbol, and decimal places. Once submitted, the token will be deployed on Hedera, and you'll receive the token address.
          </p>
        </div>

        {/* Right Column: Token Deployment Form */}
        <div>
          <h2 className="text-xl font-semibold mb-6">{currentSetupStep === 1 ? 'Deploy Token' : 'Add Token Liquidity'}</h2>
          {renderSetupStepView}
        </div>
      </div>
    </div>
  );
}
