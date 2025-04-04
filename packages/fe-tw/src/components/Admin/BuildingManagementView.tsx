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
import { DeployTreasuryAndGovernanceForm } from "./DeployTreasuryAndGovernanceForm";

type Props = {
   governance?: boolean,
   bAddress?: `0x${string}`,
};

export function BuildingManagementView(props: Props) {
   const { isConnected: isConnectedHashpack } = useWallet(HashpackConnector) || {};
   const { isConnected: isConnectedMetamask } = useWallet(MetamaskConnector) || {};
   const isGovernance = props.governance;
   const bAddress = props.bAddress;
   
   const [currentSetupStep, setCurrentSetupStep] = useState(isGovernance ? 5 : 0);
   const [basicData, setBasicData] = useState<NewBuildingFormProps | null>(null);
   const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");
   const [selectedBuildingAddress, setSelectedBuildingAddress] = useState<`0x${string}` | undefined>(bAddress);

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
            <StepperSeparator />
            <StepperStep isSelected={currentSetupStep === 7} onClick={() => setCurrentSetupStep(7)}>
               7
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
                        onGetNextStep={() => {
                           setCurrentSetupStep(5);
                        }}
                        buildingAddress={selectedBuildingAddress}
                        setSelectedBuildingAddress={(address) => {
                           setSelectedBuildingAddress(address);
                        }}
                     />
                  ) : currentSetupStep === 5 ? (
                     <DeployTreasuryAndGovernanceForm
                        buildingAddress={selectedBuildingAddress}
                        onGetNextStep={() => {
                           setCurrentSetupStep(6)
                        }}
                     /> 
                  ) : currentSetupStep === 6 ? (
                     <AddBuildingTokenLiquidityForm
                        buildingAddress={selectedBuildingAddress}
                        onGetNextStep={() => {
                           setCurrentSetupStep(7)
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
