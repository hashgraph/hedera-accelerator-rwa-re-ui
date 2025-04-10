"use client";
import * as React from "react";
import { useState } from "react";
import { Form, Formik } from "formik";
import some from "lodash/some";
import { Button } from "@/components/ui/button";
import {
   DEPLOYMENT_STEP_TO_FRIENDLY_NAME,
   ERROR_TO_DESCRIPTION,
   FRIENDLY_STEP_NAME,
   FRIENDLY_STEP_STATUS,
   INITIAL_VALUES,
   STEPS,
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
   const [isModalOpened, setIsModalOpened] = useState(false);
   const [result, setResult] = useState();
   const [error, setError] = useState<Error | null>(null);
   const { currentDeploymentStep, submitBuilding } = useBuildingOrchestration();
   const [majorDeploymentStep, minorDeploymentStep] = currentDeploymentStep;
   const [currentSetupStep, setCurrentSetupStep] = useState(1);

   const getCurrentState = (isSelected, hasErrors, isDirty, isSubmitting) => {
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

   const handleSubmit = async (values) => {
      setIsModalOpened(true);
      const { data: addresses, error } = await tryCatch(submitBuilding(values));

      if (error) {
         setError(error.message as Error);
         return;
      }
      setResult(addresses);
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
            {({ errors, touched, isSubmitting }) => (
               <Form>
                  <Stepper>
                     {STEPS.map((step, index) => {
                        const currentState = getCurrentState(
                           currentSetupStep === index + 1,
                           some(errors[step], (_, value) => !!value),
                           some(touched[step], (_, value) => !!value),
                           isSubmitting,
                        );
                        return (
                           <StepperStep
                              key={step}
                              data-state={currentState}
                              onClick={() => setCurrentSetupStep(index + 1)}
                           >
                              <StepperStepContent>
                                 <StepperStepTitle>{FRIENDLY_STEP_NAME[step]}</StepperStepTitle>
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
                        <Button type="submit">Deploy Building</Button>
                     )}
                  </div>
               </Form>
            )}
         </Formik>

         <Dialog open={isModalOpened} onOpenChange={(state) => setIsModalOpened(state)}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>
                     {error
                        ? "Error occurred"
                        : `${DEPLOYMENT_STEP_TO_FRIENDLY_NAME[majorDeploymentStep]} Deployment`}
                  </DialogTitle>

                  <DialogDescription className="flex flex-col justify-center text-xl items-center gap-4 p-10">
                     {result ? (
                        <Check size={64} className="text-green-500" />
                     ) : error ? (
                        <TriangleAlert size={64} className="text-red-500" />
                     ) : (
                        <Loader size={64} className="animate-spin" />
                     )}
                     {result ? (
                        <>
                           <span>
                              Deployment of the building and its parts was successful!
                              <br />
                              Here you can see your&nbsp;
                              <Link
                                 className="underline font-semibold"
                                 href={`/building/${result.buildingAddress}`}
                              >
                                 building
                              </Link>
                           </span>
                        </>
                     ) : error ? (
                        ERROR_TO_DESCRIPTION[error]
                     ) : (
                        DEPLOYMENT_STEP_TO_FRIENDLY_NAME[minorDeploymentStep]
                     )}
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default BuildingManagement;
