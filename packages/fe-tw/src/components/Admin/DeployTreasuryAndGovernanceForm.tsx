import { useGovernanceAndTreasuryDeployment } from "@/hooks/useGovernanceAndTreasuryDeployment";
import { GovernancePayload, TreasuryPayload } from "@/types/erc3643/types";
import { Button } from "@/components/ui/button";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { Formik, Form } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner";

type Props = {
    buildingAddress?: `0x${string}`,
    onGetNextStep: () => void,
}

const initialValuesGovernance = {
    governanceName: '',
};

const initialValuesTreasury = {
    reserve: '',
    npercentage: '',
};

export const DeployTreasuryAndGovernanceForm = ({ buildingAddress, onGetNextStep }: Props) => {
    const [formIndex, setFormIndex] = useState<number>(0);
    const { deployedBuildingTokens } = useBuildingDetails(buildingAddress);
    const buildingTokenAddress = deployedBuildingTokens?.[0]?.tokenAddress;

    const { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress, governanceAddress } =
        useGovernanceAndTreasuryDeployment(buildingAddress, buildingTokenAddress);

    const handleDeployBuildingTreasury = async (values: TreasuryPayload) => {
        try {
            const tx = await deployBuildingTreasury(values);
            toast.success(tx, {
                style: { maxWidth: "unset" },
                duration: 10000,
            });

            setFormIndex(1);
        } catch (err) {
            toast.error((err as { message: string })?.message, {
                style: { maxWidth: "unset" },
            });
        }
    };

    const handleDeployBuildingGovernance = async (values: GovernancePayload) => {
        try {
            const tx = await deployBuildingGovernance(values);
            toast.success(tx, {
                style: { maxWidth: "unset" },
                duration: 10000,
            });
        } catch (err) {
            toast.error((err as { message: string })?.message, {
                style: { maxWidth: "unset" },
            });
        }
    };

    useEffect(() => {
        if (!!buildingTokenAddress && !!treasuryAddress) {
            setFormIndex(1);
        }
    }, [treasuryAddress, governanceAddress, buildingTokenAddress]);

    return (
            <div className="mt-10 bg-white p-8 border rounded-lg">
                <h3 className="text-xl font-semibold mb-5">
                    {formIndex === 0 ? 'Deploy Treasury' : 'Deploy Governance'}
                </h3>
                {!buildingTokenAddress && (
                    <div className="bg-red-200 p-5 mt-5 mb-5">
                        <p className="text-sm">In order to deploy treasury and governance deploy building ERC3643 token first.</p>
                    </div>
                )}
                {formIndex === 0 ? (
                    <Formik
                        initialValues={initialValuesTreasury}
                        validationSchema={Yup.object({
                            reserve: Yup.string().required("Required"),
                            npercentage: Yup.string().required("Required"),
                        })}
                        onSubmit={handleDeployBuildingTreasury}
                    >
                        {({ isValid, getFieldProps }) => (
                            <Form className="space-y-4">
                                <div>
                                    <Label htmlFor="reserve">
                                        Reserve
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="E.g: 10"
                                        className="mt-2"
                                        {...getFieldProps('reserve')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="npercentage">
                                       NPercentage
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="E.g: 10"
                                        className="mt-2"
                                        {...getFieldProps('npercentage')}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Deploy
                                </Button>
                            </Form>
                        )}
                    </Formik>
                ): !governanceAddress && (
                    <Formik
                        initialValues={initialValuesGovernance}
                        validationSchema={Yup.object({
                            governanceName: Yup.string().required("Required"),
                        })}
                        onSubmit={handleDeployBuildingGovernance}>
                        {({ isValid, getFieldProps }) => (
                            <Form className="space-y-4">
                                <div>
                                    <Label htmlFor="governanceName">
                                        Governance Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="E.g: 10"
                                        className="mt-2"
                                        {...getFieldProps('governanceName')}
                                    />
                                </div>
                                <div className="flex gap-5 mt-5 justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!isValid}
                                    >
                                        Deploy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => onGetNextStep()}
                                    >
                                        Add Liquidity
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>    
                )}
                <div className="mt-5 flex flex-col">
                    {treasuryAddress && <div className="mt-2 text-sm text-purple-700" onClick={() => {
                        navigator.clipboard.writeText(treasuryAddress);
                        
                        toast.success("Address copied!", {
                            icon: "✅",
                            style: { maxWidth: "unset" },
                            duration: 5000,
                        });
                    }}>
                        Treasury Address: <span className="font-bold cursor-pointer">{treasuryAddress}</span>
                    </div>}
                    {governanceAddress && <div className="mt-2 text-sm text-purple-700"  onClick={() => {
                        navigator.clipboard.writeText(governanceAddress);
                        
                        toast.success("Address copied!", {
                            icon: "✅",
                            style: { maxWidth: "unset" },
                            duration: 5000,
                        });
                    }}>
                        Governance Address: <span className="font-bold cursor-pointer">{governanceAddress}</span>
                    </div>}
                </div>
            </div>
    );
};
