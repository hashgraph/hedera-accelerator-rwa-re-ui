"use client";

import { DeployBuilding } from "@/components/Account/DeployBuilding";
import {
   DeployBuildingBasicMetadata,
   type NewBuildingFormProps,
} from "@/components/Account/DeployBuildingBasicMetadata";
import { DeployBuildingCopeMetadata } from "@/components/Account/DeployBuildingCopeMetadata";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import {
   HashpackConnector,
   MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import React, { useState } from "react";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";
import { AdminInfoPanel } from "./AdminInfoPanel";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";
import { DeployBuildingVaultCompounderForm } from "./DeployBuildingVaultCompounderForm";
import { Stepper, StepperSeparator, StepperStep } from "@/components/ui/stepper";

export function BuildingManagementView() {
   const { isConnected: isConnectedHashpack } = useWallet(HashpackConnector) || {};

   const { isConnected: isConnectedMetamask } = useWallet(MetamaskConnector) || {};

   const [currentSetupStep, setCurrentSetupStep] = useState(1);

   const [basicData, setBasicData] = useState<NewBuildingFormProps | null>(null);
   const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}`>();

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <AdminInfoPanel />

         <Stepper variant="fullWidth" size="md">
            <StepperStep isSelected={currentSetupStep === 1} onClick={() => setCurrentSetupStep(1)}>
               1
            </StepperStep>
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 2} onClick={() => setCurrentSetupStep(2)}>
               2
            </StepperStep>
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 3} onClick={() => setCurrentSetupStep(3)}>
               3
            </StepperStep>
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 4} onClick={() => setCurrentSetupStep(4)}>
               4
            </StepperStep>
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 5} onClick={() => setCurrentSetupStep(5)}>
               5
            </StepperStep>
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 6} onClick={() => setCurrentSetupStep(6)}>
               6
            </StepperStep>
         </Stepper>

         <div className="flex flex-col md:flex-row gap-6">
            {isConnectedHashpack || isConnectedMetamask ? (
               <div className="flex-1">
                  {currentSetupStep === 1 ? (
                     <DeployBuildingBasicMetadata
                        onBasicMetadataComplete={(data) => {
                           setBasicData(data);
                           setCurrentSetupStep(2);
                        }}
                        setDeployStep={setCurrentSetupStep}
                     />
                  ) : currentSetupStep === 2 ? (
                     !basicData ? (
                        <p>Error: missing basic data from step 1</p>
                     ) : (
                        <DeployBuildingCopeMetadata
                           basicData={basicData}
                           onCopeDeployed={(ipfsHash) => {
                              setDeployedMetadataIPFS(ipfsHash);
                              setCurrentSetupStep(3);
                           }}
                           onBack={() => setCurrentSetupStep(1)}
                        />
                     )
                  ) : currentSetupStep === 3 ? (
                     <DeployBuilding
                        deployedMetadataIPFS={deployedMetadataIPFS}
                        onBuildingDeployed={() => {
                           setCurrentSetupStep(4);
                        }}
                     />
                  ) : currentSetupStep === 4 ? (
                     <DeployBuildingERC3643TokenForm
                        onGetLiquidityView={(buildingAddress) => {
                           setCurrentSetupStep(5);
                           setSelectedBuildingAddress(buildingAddress);
                        }}
                        onGetDeployBuildingView={() => {
                           setCurrentSetupStep(3);
                        }}
                     />
                  ) : currentSetupStep === 5 ? (
                     <AddBuildingTokenLiquidityForm
                        buildingAddress={
                           selectedBuildingAddress || "0x0000000000000000000000000000000000000001"
                        }
                        onGetDeployBuildingTokenView={() => {
                           setCurrentSetupStep(4);
                        }}
                        onGetDeployATokenView={() => {
                           setCurrentSetupStep(6);
                        }}
                     />
                  ) : (
                     <DeployBuildingVaultCompounderForm />
                  )}
               </div>
            ) : (
               <div className="flex-1 text-gray-700">Please connect wallet</div>
            )}
         </div>
      </div>
   );
}
