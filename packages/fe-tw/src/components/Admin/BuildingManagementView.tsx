"use client";

import { AdminInfoPanel } from "./AdminInfoPanel";
import { AddBuildingForm } from "./AddBuildingForm";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";
import { useState, useMemo } from "react";

export function BuildingManagementView() {
  const [currentSetupStep, setCurrentSetupStep] = useState(1);
  const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();

  const renderSetupStepView = useMemo(() => {
    if (currentSetupStep === 1) {
      return (
        <AddBuildingForm onBuildingDeployed={() => {
          setCurrentSetupStep(2);
        }} />
      )
    } else if (currentSetupStep === 2) {
      return (
        <DeployBuildingERC3643TokenForm
          onGetLiquidityView={(buildingAddress: `0x${string}`) => {
            setCurrentSetupStep(3);
            setSelectedBuildingAddress(buildingAddress);
          }}
          onGetDeployBuildingView={() => {
            setCurrentSetupStep(1);
          }}
        />
      )
    } else if (currentSetupStep === 3) {
      return (
        <AddBuildingTokenLiquidityForm
          buildingAddress={selectedBuildingAddress as `0x${string}`}
          onGetDeployBuildingTokenView={() => {
            setCurrentSetupStep(2);
          }}
        />
      )
    }
  }, [currentSetupStep])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminInfoPanel />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {renderSetupStepView}
        </div>
      </div>
    </div>
  );
}
