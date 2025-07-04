"use client";
import * as React from "react";
import { useState } from "react";
import { Formik, FormikHelpers, FormikValues } from "formik";
import some from "lodash/some";
import { Button } from "@/components/ui/button";
import {
   ERROR_TO_DESCRIPTION,
   FRIENDLY_STEP_NAME,
   FRIENDLY_STEP_STATUS,
   INITIAL_VALUES,
   MAJOR_STEP_TO_FRIENDLY_NAME,
   MINOR_STEP_TO_FRIENDLY_NAME,
   STEPS,
   stepsKeyTypes,
   VALIDATION_SCHEMA,
} from "./constants";
import { useBuildingOrchestration } from "./hooks";
import {
   Stepper,
   StepperStep,
   StepperStepContent,
   StepperStepStatus,
   StepperStepTitle,
} from "@/components/ui/stepper";
import BuildingInfoForm from "./infoForm";
import TreasuryGovernanceAndVaultForm from "./treasuryGovernanceAndVaultForm";
import TokenForm from "./tokenForm";
import { Check, Loader, TriangleAlert } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { tryCatch } from "@/services/tryCatch";
import { Error, StepsStatus } from "./types";
import Link from "next/link";

const BuildingManagement = () => {
   const [isModalOpened, setIsModalOpened] = useState<boolean>();
   const [newBuildingAddress, setNewBuildingAddress] = useState<string | null>();
   const [error, setError] = useState<Error | null>(null);
   const { currentDeploymentStep, submitBuilding } = useBuildingOrchestration();
   const [majorDeploymentStep, minorDeploymentStep] = currentDeploymentStep;
   const [currentSetupStep, setCurrentSetupStep] = useState(1);

   const getCurrentState = (
      isSelected: boolean,
      hasErrors: boolean,
      isDirty: boolean,
      isSubmitting: boolean,
   ) => {
      if (isSelected && !isSubmitting) {
         return StepsStatus.IN_PROGRESS;
      }
      if (isDirty) {
         if (hasErrors) {
            return StepsStatus.INVALID;
         }
         return StepsStatus.VALID;
      }
      return StepsStatus.NOT_STARTED;
   };

   const handleSubmit = async (values: any, formikHelpers: any) => {
      setIsModalOpened(true);
      const { data: buildingAddress, error } = await tryCatch(submitBuilding(values));

      if (error) {
         setError(error.message as Error);
         return;
      }
      formikHelpers.resetForm();
      setNewBuildingAddress(buildingAddress);
   };

   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Building Management</h1>
         <p className="mb-4">
            Manage your buildings, including deploying and updating building metadata.
         </p>

         <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={VALIDATION_SCHEMA}
            onSubmit={handleSubmit}
         >
            {({ errors, touched, isSubmitting, submitForm }) => (
               <>
                  <Stepper>
                     {STEPS.map((step, index) => {
                        const currentState = getCurrentState(
                           currentSetupStep === index + 1,
                           some((errors)[step as stepsKeyTypes], (_, value) => !!value),
                           some((touched)[step as stepsKeyTypes], (_, value) => !!value),
                           isSubmitting,
                        );
                        return (
                           <StepperStep
                              key={step}
                              data-state={currentState}
                              data-testid={`stepper-step-${step}`}
                              onClick={() => setCurrentSetupStep(index + 1)}
                           >
                              <StepperStepContent>
                                 <StepperStepTitle>{(FRIENDLY_STEP_NAME )[step as stepsKeyTypes]}</StepperStepTitle>
                                 <StepperStepStatus>
                                    {FRIENDLY_STEP_STATUS[currentState]}
                                 </StepperStepStatus>
                              </StepperStepContent>
                           </StepperStep>
                        );
                     })}
                  </Stepper>

                  <div className="mt-4">
                     {currentSetupStep === 1 && <BuildingInfoForm />}
                     {currentSetupStep === 2 && <TokenForm />}
                     {currentSetupStep === 3 && <TreasuryGovernanceAndVaultForm />}
                  </div>

                  <div className="flex justify-end">
                     {currentSetupStep !== 3 ? (
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
                           Deploy Building
                        </Button>
                     )}
                  </div>
               </>
            )}
         </Formik>

         <Dialog open={isModalOpened} onOpenChange={(state) => setIsModalOpened(state)}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
               <DialogHeader>
                  <DialogTitle>
                     {error
                        ? "Error occurred"
                        : `${MAJOR_STEP_TO_FRIENDLY_NAME[majorDeploymentStep!]} Deployment`}
                  </DialogTitle>

                  <DialogDescription className="flex flex-col justify-center text-xl items-center gap-4 p-10">
                     {newBuildingAddress ? (
                        <Check size={64} className="text-violet-500" />
                     ) : error ? (
                        <TriangleAlert size={64} className="text-red-500" />
                     ) : (
                        <Loader size={64} className="animate-spin" />
                     )}
                     {newBuildingAddress ? (
                        <>
                           <span>
                              Deployment of the building and its parts was successful!
                              <br />
                              One step remains to be done - you need to add&nbsp;
                              <Link
                                 className="underline font-semibold"
                                 href={`/building/${newBuildingAddress}/liquidity`}
                              >
                                 liquidity
                              </Link>
                           </span>
                        </>
                     ) : error ? (
                        ERROR_TO_DESCRIPTION[error]
                     ) : (
                        (MINOR_STEP_TO_FRIENDLY_NAME)[(majorDeploymentStep as 100)!][(minorDeploymentStep as 1 | 2| 3)!]
                     )}
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default BuildingManagement;
