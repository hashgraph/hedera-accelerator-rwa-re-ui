"use client";

import React, { useMemo, useState } from "react";
import { AdminInfoPanel } from "./AdminInfoPanel";
import { DeployBuildingCopeMetadata } from "@/components/Account/DeployBuildingCopeMetadata";
import { DeployBuilding } from "@/components/Account/DeployBuilding";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";
import { DeployBuildingBasicMetadata, NewBuildingFormProps } from "@/components/Account/DeployBuildingBasicMetadata"; 

export function BuildingManagementView() {
  const [currentSetupStep, setCurrentSetupStep] = useState(1);

  const [basicData, setBasicData] = useState<NewBuildingFormProps | null>(null);
  const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");
  const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();

  const renderSetupStepView = useMemo(() => {
    if (currentSetupStep === 1) {
      return (
        <DeployBuildingBasicMetadata
          onBasicMetadataComplete={(data) => {
            setBasicData(data);
            setCurrentSetupStep(2);
          }}
        />
      );
    }

    if (currentSetupStep === 2) {
      if (!basicData) {
        return <p>Error: missing basic data from step 1</p>;
      }
      return (
        <DeployBuildingCopeMetadata
          basicData={basicData}
          onCopeDeployed={(ipfsHash) => {
            setDeployedMetadataIPFS(ipfsHash);
            setCurrentSetupStep(3);
          }}
          onBack={() => setCurrentSetupStep(1)}
        />
      );
    }

    if (currentSetupStep === 3) {
      return (
        <DeployBuilding
          deployedMetadataIPFS={deployedMetadataIPFS}
          onBuildingDeployed={() => {
            setCurrentSetupStep(4);
          }}
        />
      );
    }

    if (currentSetupStep === 4) {
      return (
        <DeployBuildingERC3643TokenForm
          onGetLiquidityView={(buildingAddress) => {
            setCurrentSetupStep(5);
            setSelectedBuildingAddress(buildingAddress);
          }}
          onGetDeployBuildingView={() => {
            setCurrentSetupStep(3);
          }}
        />
      );
    }

    // Step 5: Add Liquidity
    if (currentSetupStep === 5) {
      return (
        <AddBuildingTokenLiquidityForm
          buildingAddress={selectedBuildingAddress || "0x0000000000000000000000000000000000000001"}
          onGetDeployBuildingTokenView={() => {
            setCurrentSetupStep(4);
          }}
        />
      );
    }
  }, [
    currentSetupStep,
    basicData,
    deployedMetadataIPFS,
    selectedBuildingAddress,
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminInfoPanel />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">{renderSetupStepView}</div>
      </div>
    </div>
  );
}
