import { BuildingDetailsView } from "@/components/FetchViews/BuildingDetailsView";
import { useBuildings } from "@/hooks/useBuildings";
import { useATokenDeployFlow } from "@/hooks/vault/useATokenDeployFlow";
import { useATokenVaultData } from "@/hooks/vault/useATokenVaultData";
import type {
   BuildingToken,
   DeployAutoCompounderRequest,
   DeployVaultRequest,
} from "@/types/erc3643/types";
import { Field, Form, Formik } from "formik";
import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DeployVaultForm = ({
   handleDeploy,
   setDeployStep,
}: {
   handleDeploy: (data: DeployVaultRequest) => void;
   setDeployStep: (stepId: number) => void;
}) => {
   const [buildingDeployedTokens, setBuildingDeployedTokens] = useState<BuildingToken[]>([]);
   const { buildings } = useBuildings();
   const initialValues = {
      stakingToken: "",
      shareTokenName: "",
      shareTokenSymbol: "",
      vaultRewardController: "",
      feeConfigController: "",
      feeReceiver: "",
      feeToken: "",
      feePercentage: undefined,
   };

   const buildingAssetsOptions = useMemo(
      () => [
         ...buildingDeployedTokens.map((token) => ({
            value: token.tokenAddress,
            label: token.tokenAddress, // todo: replace with token name
         })),
         {
            value: "0x0000000000000000000000000000000000211103",
            label: "USDC",
         },
      ],
      [buildingDeployedTokens],
   );

   return (
      <div className="bg-white p-6 border rounded-lg">
         <h3 className="text-xl font-semibold mb-4">Deploy Vault</h3>

         <Formik initialValues={initialValues} onSubmit={handleDeploy}>
            {({ setFieldValue, getFieldProps, values }) => (
               <Form>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="">Staking token</Label>

                        <Select
                           name="stakingToken"
                           onValueChange={(value) => setFieldValue("stakingToken", value)}
                           value={values.stakingToken}
                        >
                           <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Choose staking token" />
                           </SelectTrigger>
                           <SelectContent>
                              {buildingAssetsOptions.map((option) => (
                                 <SelectItem key={option.value} value={option.value}>
                                    {option.label} ({option.value})
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div>
                        <Label htmlFor="shareTokenName">Share token name</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("shareTokenName")}
                           placeholder="e.g. SOL"
                        />
                     </div>
                     <div>
                        <Label htmlFor="shareTokenSymbol">Share token symbol</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("shareTokenSymbol")}
                           placeholder="e.g. SOL"
                        />
                     </div>
                     <div>
                        <Label htmlFor="feeReceiver">Fee receiver address</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("feeReceiver")}
                           placeholder="e.g. 0x"
                        />
                     </div>
                     <div>
                        <Label htmlFor="feeToken">Fee token</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("feeToken")}
                           placeholder="e.g. 0x"
                        />
                     </div>
                     <div>
                        <Label htmlFor="feePercentage">Fee percentage</Label>
                        <Input
                           className="mt-1"
                           {...getFieldProps("feePercentage")}
                           placeholder="e.g. 20"
                        />
                     </div>
                  </div>
                  <div className="flex justify-end gap-5 mt-5">
                     <Button variant="outline" type="button" onClick={() => setDeployStep(2)}>
                        Deploy Auto Compounder
                     </Button>
                     <Button type="submit">Deploy</Button>
                  </div>
               </Form>
            )}
         </Formik>

         {buildings.map((building) => (
            <BuildingDetailsView
               key={building.id}
               address={building.address as `0x${string}`}
               setBuildingTokens={setBuildingDeployedTokens}
            />
         ))}
      </div>
   );
};

const DeployAutoCompounderForm = ({
   handleDeploy,
}: {
   handleDeploy: (data: DeployAutoCompounderRequest) => void;
}) => {
   const initialValues = {
      tokenName: "",
      tokenSymbol: "",
      tokenAsset: "",
   };
   const { vaults } = useATokenVaultData();

   return (
      <div className="bg-white p-6 border rounded-lg">
         <h3 className="text-xl font-semibold mb-4">Deploy Auto Compounder</h3>
         <Formik initialValues={initialValues} onSubmit={handleDeploy}>
            {({ setFieldValue, getFieldProps, values }) => (
               <Form className="space-y-4">
                  <div>
                     <Label htmlFor="tokenName">Token name</Label>
                     <Input
                        className="mt-1"
                        {...getFieldProps("tokenName")}
                        placeholder="e.g. Solana"
                     />
                  </div>
                  <div>
                     <Label htmlFor="tokenSymbol">Token symbol</Label>
                     <Input
                        className="mt-1"
                        {...getFieldProps("tokenSymbol")}
                        placeholder="e.g. SOL"
                     />
                  </div>
                  <div>
                     <Label htmlFor="">Asset token</Label>

                     <Select
                        name="tokenAsset"
                        onValueChange={(value) => setFieldValue("tokenAsset", value)}
                        value={values.tokenAsset}
                     >
                        <SelectTrigger className="w-full mt-1">
                           <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                           {vaults.map((option) => (
                              <SelectItem key={option.address} value={option.address}>
                                 {option.name} ({option.address})
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex justify-end gap-5 mt-5">
                     <Button type="submit">Deploy</Button>
                  </div>
               </Form>
            )}
         </Formik>
      </div>
   );
};

export const DeployBuildingVaultCompounderForm = () => {
   const [txResults, setTxResults] = useState({
      autoCompounder: "",
      vault: "",
   });
   const [txErrors, setTxErrors] = useState({
      autoCompounder: "",
      vault: "",
   });
   const [deployStep, setDeployStep] = useState(1);
   const { handleDeployAutoCompounder, handleDeployVault } = useATokenDeployFlow();

   const onSubmitDeployStep = async (data: DeployAutoCompounderRequest | DeployVaultRequest) => {
      if (deployStep === 2) {
         try {
            const txId = await handleDeployAutoCompounder(data as DeployAutoCompounderRequest);
            setTxResults((prev) => ({
               ...prev,
               autoCompounder: txId,
            }));
         } catch (err) {
            setTxErrors((prev) => ({
               ...prev,
               autoCompounder: (err as Error)?.message,
            }));
         }
      } else {
         try {
            const txId = await handleDeployVault(data as DeployVaultRequest);
            setTxResults((prev) => ({
               ...prev,
               vault: txId,
            }));
            setDeployStep(2);
         } catch (err) {
            setTxErrors((prev) => ({
               ...prev,
               vault: (err as Error)?.message,
            }));
         }
      }
   };

   return (
      <div>
         {deployStep === 1 ? (
            <DeployVaultForm
               handleDeploy={onSubmitDeployStep}
               setDeployStep={(step) => {
                  setDeployStep(step);
               }}
            />
         ) : (
            <DeployAutoCompounderForm handleDeploy={onSubmitDeployStep} />
         )}
         {txResults.autoCompounder && (
            <div className="flex mt-5">
               <p className="text-sm font-bold text-purple-600">
                  Deployed Auto Compounder Tx Hash: {txResults.autoCompounder}
               </p>
            </div>
         )}
         {txResults.vault && (
            <div className="flex mt-5">
               <p className="text-sm font-bold text-purple-600">
                  Deployed Vault Tx Hash: {txResults.vault}
               </p>
            </div>
         )}
         {(txErrors.autoCompounder || txErrors.vault) && (
            <div className="flex mt-5">
               <p className="text-sm font-bold text-purple-600">
                  Deployed Tx Error: {txErrors.autoCompounder || txErrors.vault}
               </p>
            </div>
         )}
      </div>
   );
};
