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
import { Button } from "react-daisyui";
import Select, { type SingleValue } from "react-select";

const colourStyles = {
  control: (styles: object) => ({
    ...styles,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
  }),
  option: (styles: any) => ({
    ...styles,
    backgroundColor: "#fff",
    color: "#000",
    ":active": {
      ...styles[":active"],
      backgroundColor: "#9333ea36",
    },
    ":focused": {
      backgroundColor: "#9333ea36",
    },
  }),
};

const DeployVaultForm = ({
  handleDeploy,
  setDeployStep,
}: {
  handleDeploy: (data: DeployVaultRequest) => void;
  setDeployStep: (stepId: number) => void;
}) => {
  const [buildingDeployedTokens, setBuildingDeployedTokens] = useState<
    BuildingToken[]
  >([]);
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
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Staking token
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="e.g. 0x"
                options={buildingAssetsOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("stakingToken", option?.value || "");
                }}
                value={
                  values.stakingToken
                    ? {
                        value: values.stakingToken,
                        label:
                          buildingAssetsOptions.find(
                            (t) => t.value === values.stakingToken,
                          )?.label || values.stakingToken,
                      }
                    : null
                }
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="shareTokenName"
              >
                Share token name
              </label>
              <Field
                name="shareTokenName"
                className="input w-full mt-2"
                placeholder="e.g. SOL"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="shareTokenSymbol"
              >
                Share token symbol
              </label>
              <Field
                name="shareTokenSymbol"
                className="input w-full mt-2"
                placeholder="e.g. SOL"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="feeReceiver"
              >
                Fee receiver address
              </label>
              <Field
                name="feeReceiver"
                className="input w-full mt-2"
                placeholder="e.g. 0x"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="feeToken"
              >
                Fee token
              </label>
              <Field
                name="feeToken"
                className="input w-full mt-2"
                placeholder="e.g. 0x"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="feePercentage"
              >
                Fee percentage
              </label>
              <Field
                name="feePercentage"
                className="input w-full mt-2"
                placeholder="e.g. 20"
              />
            </div>
            <div className="flex gap-5 mt-5">
              <Button className="pr-10 pl-10" type="submit" color="primary">
                Deploy
              </Button>
              <Button
                className="pr-10 pl-10"
                type="button"
                onClick={() => setDeployStep(2)}
              >
                Deploy Auto Compounder
              </Button>
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
}: { handleDeploy: (data: DeployAutoCompounderRequest) => void }) => {
  const initialValues = {
    tokenName: "",
    tokenSymbol: "",
    tokenAsset: "",
  };
  const { vaults } = useATokenVaultData();

  const assetSelectOptions = vaults.map((vault) => ({
    value: vault.address,
    label: vault.name,
  }));

  return (
    <div className="bg-white p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Deploy Auto Compounder</h3>
      <Formik initialValues={initialValues} onSubmit={handleDeploy}>
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="tokenName"
              >
                Token name
              </label>
              <Field
                name="tokenName"
                className="input w-full mt-2"
                placeholder="e.g. Solana"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor="tokenSymbol"
              >
                Token symbol
              </label>
              <Field
                name="tokenSymbol"
                className="input w-full mt-2"
                placeholder="e.g. SOL"
              />
            </div>
            <div>
              <label
                className="block text-md font-semibold text-purple-400"
                htmlFor=""
              >
                Asset token
              </label>
              <Select
                styles={colourStyles}
                className="mt-2"
                placeholder="e.g. 0x"
                options={assetSelectOptions}
                onChange={(
                  option: SingleValue<{ value: string; label: string }>,
                ) => {
                  setFieldValue("tokenAsset", option?.value || "");
                }}
                value={
                  values.tokenAsset
                    ? {
                        value: values.tokenAsset,
                        label:
                          assetSelectOptions.find(
                            (t) => t.value === values.tokenAsset,
                          )?.label || values.tokenAsset,
                      }
                    : null
                }
              />
            </div>
            <Button className="pr-10 pl-10" type="submit" color="primary">
              Deploy
            </Button>
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
  const { handleDeployAutoCompounder, handleDeployVault } =
    useATokenDeployFlow();

  const onSubmitDeployStep = async (
    data: DeployAutoCompounderRequest | DeployVaultRequest,
  ) => {
    if (deployStep === 2) {
      try {
        const txId = await handleDeployAutoCompounder(
          data as DeployAutoCompounderRequest,
        );
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
