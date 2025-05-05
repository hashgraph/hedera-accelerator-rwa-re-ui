"use client";

import { Formik } from "formik";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, TriangleAlert, Loader } from "lucide-react";
import { tryCatch } from "@/services/tryCatch";
import { Button } from "@/components/ui/button";
import {
    Stepper,
    StepperStep,
    StepperStepContent,
    StepperStepStatus,
    StepperStepTitle,
} from "@/components/ui/stepper";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { CreateSliceRequestData, SliceDeploymentStep } from "@/types/erc3643/types";
import { useCreateSlice } from "@/hooks/useCreateSlice";
import { AddSliceForm } from "@/components/Admin/sliceManagement/AddSliceForm";
import { AddSliceAllocationForm } from "@/components/Admin/sliceManagement/AddSliceAllocationForm";
import { INITIAL_VALUES, STEPS, FRIENDLY_STEP_NAME, FRIENDLY_STEP_STATUS, VALIDATION_SCHEMA } from "@/components/Admin/sliceManagement/constants";
import { StepsStatus } from "../buildingManagement/types";

const getCurrentStepState = (
    isSelected: boolean,
    errors: any,
    touched: any,
    isSubmitting: boolean,
    step: SliceDeploymentStep,
): StepsStatus => {
    if (isSelected && !isSubmitting) {
        return StepsStatus.IN_PROGRESS;
    }

    if (!!touched[step]) {
        if (!!errors[step]) {
            return StepsStatus.INVALID;
        }

        return StepsStatus.VALID;
    }

    return StepsStatus.NOT_STARTED;
};

export const SliceManagement = () => {
    const [currentSetupStep, setCurrentSetupStep] = useState(1);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [txResult, setTxResult] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [isTransactionInProgress, setIsTransactionInProgress] = useState<boolean>(false);
    const { createSlice, waitForLastSliceDeployed, addSliceAllocationMutation } = useCreateSlice();

    const handleSubmit = async (values: CreateSliceRequestData, e: { resetForm: () => void }) => {
        setIsModalOpened(true);
        setIsTransactionInProgress(true);
        e.resetForm();
        setCurrentSetupStep(1);

        try {
            const results = await Promise.all([
                tryCatch(createSlice(values)),
                tryCatch(waitForLastSliceDeployed())
            ]);

            if (results[0].data) {
                setTxResult(results[0].data);
                toast.success(`Slice ${values.slice.name} created successfully`);
    
                if (results[1].data) {
                    await addSliceAllocationMutation.mutateAsync({
                        ...values,
                        slice: results[1].data,
                    });
                }
            } else {
                setTxError(results[0].error?.message);
            }
        } catch (err) {
            setTxError((err as { message: string }).message);
        } finally {
            setIsTransactionInProgress(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Slice Management</h1>
            <p className="mb-4">
                Create and manage slice, include deployment of new slice.
            </p>

            {isTransactionInProgress ? (
                <LoadingView isLoading />
            ) : (
                <Formik
                    initialValues={INITIAL_VALUES}
                    validationSchema={VALIDATION_SCHEMA}
                    onSubmit={handleSubmit}
                >
                {({ errors, touched, isSubmitting, submitForm }) => (
                    <>
                        <Stepper>
                            {STEPS.map((step, stepId) => {
                                const currentState = getCurrentStepState(
                                    currentSetupStep === stepId + 1,
                                    errors,
                                    touched,
                                    isSubmitting,
                                    step as SliceDeploymentStep,
                                );

                                return (
                                    <StepperStep
                                        key={step}
                                        data-state={currentState}
                                        onClick={() => setCurrentSetupStep(stepId + 1)}
                                    >
                                        <StepperStepContent>
                                            <StepperStepTitle>
                                                {FRIENDLY_STEP_NAME[step as 'slice']}
                                            </StepperStepTitle>
                                            <StepperStepStatus>
                                                {FRIENDLY_STEP_STATUS[currentState]}
                                            </StepperStepStatus>
                                        </StepperStepContent>
                                    </StepperStep>
                                );
                            })}
                        </Stepper>

                        <div className="mt-4">
                            {currentSetupStep === 1 && (
                                <AddSliceForm />
                            )}
                            {currentSetupStep === 2 && (
                                <AddSliceAllocationForm />
                            )}
                        </div>

                        <div className="flex justify-end mt-10">
                            {currentSetupStep === 1 ? (
                                <Button
                                    size="lg"
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentSetupStep((step) => step + 1)}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" onClick={submitForm}>
                                    Deploy Slice
                                </Button>
                            )}
                        </div>
                    </>
                )}
                </Formik>
            )}

            <Dialog open={isModalOpened} onOpenChange={(state) => setIsModalOpened(state)}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>
                            {txError || txResult ?
                                <span>
                                    {txError ? "Deployment error" : "Deployment success"}
                                </span>
                            : "Deployment in progress..."}
                        </DialogTitle>

                        <DialogDescription className="flex flex-col justify-center text-xl items-center gap-4 p-10">
                            {(txResult || txError) ?
                                txError ? (
                                    <>
                                        <span>Deployment error: {txError}</span>
                                        <TriangleAlert size={64} className="text-red-500" />
                                    </>
                                ) : (
                                    <>
                                        <Check size={64} className="text-violet-500" />
                                        {addSliceAllocationMutation.data ?
                                            <span>
                                                Deployment of the slice and its parts such as allocation was deployed successfully!
                                            </span> :
                                            <span>
                                                Deployment of the slice was successfull! Still waiting for allocation to be deployed.
                                            </span>
                                        }
                                    </>
                                ) : (
                                    <Loader size={64} className="animate-spin" />
                                )
                            }
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}