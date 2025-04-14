"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
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
import { LoadingView } from "@/components/LoadingView/LoadingView";
import { getBuildingStateSummary } from "@/hooks/useBuildingInfo";
import { getStartFromDeployment } from "@/components/Admin/buildingManagement/helpers";

const BuildingManagement = ({ id }: { id?: string }) => {
   const [isModalOpened, setIsModalOpened] = useState();
   const [result, setResult] = useState();
   const [error, setError] = useState<Error | null>(null);
   const { buildingDetails, currentDeploymentStep, submitBuilding } = useBuildingOrchestration({
      id,
   });
   const [majorDeploymentStep, minorDeploymentStep] = currentDeploymentStep;
   const [currentSetupStep, setCurrentSetupStep] = useState(1);

   const buildingInfo = getBuildingStateSummary(buildingDetails);
   const {
      buildingDeployed,
      tokenDeployed,
      tokensMinted,
      treasuryDeployed,
      governanceDeployed,
      vaultDeployed,
   } = buildingInfo;

   useEffect(() => {
      if (!buildingDeployed) {
         setCurrentSetupStep(1);
         return;
      }

      if (!tokenDeployed || !tokensMinted) {
         setCurrentSetupStep(2);
         return;
      }

      if (!treasuryDeployed || !governanceDeployed || !vaultDeployed) {
         setCurrentSetupStep(3);
         return;
      }
   }, [buildingDetails.isLoading]);

   const getCurrentState = (isSelected, hasErrors, isDirty, isSubmitting, step) => {
      if (step === "info" && buildingDeployed) {
         return StepsStatus.DEPLOYED;
      }

      if (step === "token" && tokenDeployed && tokensMinted) {
         return StepsStatus.DEPLOYED;
      }

      if (
         step === "treasuryAndGovernance" &&
         treasuryDeployed &&
         governanceDeployed &&
         vaultDeployed
      ) {
         return StepsStatus.DEPLOYED;
      }

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

   const handleSubmit = async (values, formikHelpers) => {
      setIsModalOpened(true);
      const { data: addresses, error } = await tryCatch(
         submitBuilding(values, getStartFromDeployment(buildingInfo)),
      );

      if (error) {
         setError(error.message as Error);
         return;
      }
      formikHelpers.resetForm();
      setResult(addresses);
   };

   return (
      <div>
         <h1 className="text-2xl font-bold mb-4">Building Management</h1>
         <p className="mb-4">
            Manage your buildings, including deploying and updating building metadata.
         </p>

         {id && buildingDetails?.isLoading ? (
            <LoadingView isLoading={buildingDetails?.isLoading} />
         ) : (
            <Formik
               initialValues={INITIAL_VALUES}
               validationSchema={VALIDATION_SCHEMA({
                  buildingDeployed,
                  tokenDeployed,
                  tokensMinted,
                  treasuryDeployed,
                  governanceDeployed,
                  vaultDeployed,
               })}
               onSubmit={handleSubmit}
            >
               {({ errors, touched, isSubmitting, submitForm }) => (
                  <>
                     <Stepper>
                        {STEPS.map((step, index) => {
                           const currentState = getCurrentState(
                              currentSetupStep === index + 1,
                              some(errors[step], (_, value) => !!value),
                              some(touched[step], (_, value) => !!value),
                              isSubmitting,
                              step,
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
                        {currentSetupStep === 1 && (
                           <BuildingInfoForm buildingDeployed={buildingDeployed} />
                        )}
                        {currentSetupStep === 2 && (
                           <TokenForm tokensMinted={tokensMinted} tokenDeployed={tokenDeployed} />
                        )}
                        {currentSetupStep === 3 && (
                           <TreasuryGovernanceAndVaultForm
                              treasuryDeployed={treasuryDeployed}
                              governanceDeployed={governanceDeployed}
                              vaultDeployed={vaultDeployed}
                              autoCompounderDeployed={false} // Placeholder for auto compounder check
                           />
                        )}
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
         )}

         <Dialog open={isModalOpened} onOpenChange={(state) => setIsModalOpened(state)}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
               <DialogHeader>
                  <DialogTitle>
                     {error
                        ? "Error occurred"
                        : `${MAJOR_STEP_TO_FRIENDLY_NAME[majorDeploymentStep]} Deployment`}
                  </DialogTitle>

                  <DialogDescription className="flex flex-col justify-center text-xl items-center gap-4 p-10">
                     {result ? (
                        <Check size={64} className="text-violet-500" />
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
                        MINOR_STEP_TO_FRIENDLY_NAME[majorDeploymentStep][minorDeploymentStep]
                     )}
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default BuildingManagement;
