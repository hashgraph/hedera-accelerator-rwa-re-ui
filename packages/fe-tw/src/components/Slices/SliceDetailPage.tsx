"use client";

import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SliceAllocations from "@/components/Slices/SliceAllocations";
import { useBuildings } from "@/hooks/useBuildings";
import { useSliceData } from "@/hooks/useSliceData";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import type { AddSliceAllocationRequestBody, DepositToSliceRequestData, SliceData } from "@/types/erc3643/types";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddSliceAllocationForm } from "@/components/Admin/sliceManagement/AddSliceAllocationForm";
import { TxResultToastView } from "@/components/CommonViews/TxResultView";
import { useCreateSlice } from "@/hooks/useCreateSlice";
import { getTokenBalanceOf } from "@/services/erc20Service";
import { tryCatch } from "@/services/tryCatch";
import { SliceBuildings } from "./SliceBuildings";
import { sliceRebalanceSchema } from "./helpers";
import { DepositToSliceForm } from "../Admin/sliceManagement/DepositToSliceForm";
import SliceDepositChart from "./SliceDepositChart";
import { cx } from "class-variance-authority";

type Props = {
   slice: SliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

export function SliceDetailPage({ slice, buildingId, isInBuildingContext = false }: Props) {
   const { buildingsInfo } = useBuildings();
   const { sliceAllocations, sliceBuildings, sliceBuildingsDetails, totalDeposits } = useSliceData(
      slice.address,
      buildingsInfo,
   );
   const { data: evmAddress } = useEvmAddress();
   const { rebalanceSliceMutation, addAllocationsToSliceMutation, depositMutation } = useCreateSlice(slice.address);
   const [isAllocationOpen, setIsAllocationOpen] = useState(false);
   const [assetsOptions, setAssetsOptions] = useState<any[]>();
   const [sliceDepositValue, setSliceDepositValue] = useState<string>();
   const [depositValueInvalid, setDepositValueInvalid] = useState(false);

   useEffect(() => {
      setAssetOptionsAsync();
   }, [buildingsInfo?.length, evmAddress]);

   const setAssetOptionsAsync = async () => {
      const tokens = buildingsInfo?.map((building) => building.tokenAddress);

      if (tokens && evmAddress) {
         const balances = await Promise.all(tokens.map((tok) => getTokenBalanceOf(tok, evmAddress)));
         const balancesToTokens = balances.map((balance, index) => ({
            balance,
            building: buildingsInfo?.[index].buildingAddress,
         }));
   
         if (buildingsInfo) {
            setAssetsOptions(buildingsInfo?.filter((b) => balancesToTokens.find((b2) => b2.building === b.buildingAddress)?.balance > 0));
         }
      }
   };

   const mappedSliceAllocations = sliceAllocations.map((asset) =>
      assetsOptions?.find((opt: any) => opt.tokenAddress === asset.buildingToken)?.buildingAddress,
   );

   const allocationsExists = sliceAllocations?.length > 0;

   const onSubmitDepositToSliceForm = async (values: DepositToSliceRequestData) => {
      try {
         setSliceDepositValue(undefined);
         const { data } = await tryCatch(depositMutation.mutateAsync(values));

         if (data) {
            toast.success(
               <TxResultToastView
                  title={`Deposit to slice ${slice.name} successfully done`}
                  txSuccess={{
                     transaction_id: (data as unknown as string[])[0],
                  }}
               />,
               { duration: Infinity, closeButton: true },
            );         
         } else {
            toast.error(
               <TxResultToastView
                  title="Error during submitting deposit"
                  txError
               />,
               { duration: Infinity, closeButton: true },
            );
         }
      } catch (err) {
         toast.error(
            <TxResultToastView
               title="Error during slice rebalance"
               txError="Error during submitting tx"
            />,
            { duration: Infinity, closeButton: true },
        );
      }
   };
   
   const onHandleRebalance = async () => {
      try {
         const { data } = await tryCatch(rebalanceSliceMutation.mutateAsync());

         if (data) {
            toast.success(
               <TxResultToastView
                  title={`Slice ${slice.name} successfully rebalanced`}
                  txSuccess={data}
               />,
               { duration: Infinity, closeButton: true },
            );
            setIsAllocationOpen(false);
         } else {
            toast.error(
               <TxResultToastView
                  title="Error during slice rebalance"
                  txError
               />,
               { duration: Infinity, closeButton: true },
            );
         }
      } catch (err) {
         toast.error(
            <TxResultToastView
               title="Error during slice rebalance"
               txError="Error during submitting tx"
            />,
            { duration: Infinity, closeButton: true },
        );
      }
   };

   const onSubmitAllocationsForm = async (values: AddSliceAllocationRequestBody) => {
      try {
         const { data } = await tryCatch(addAllocationsToSliceMutation.mutateAsync({
            sliceAllocation: values,
         }));

         if (data?.every((tx) => !!tx)) {
            toast.success(
               <TxResultToastView
                  title={`Allocation added to ${slice.name} slice`}
                  txSuccess={{
                     transaction_id: (data as unknown as string[])[0],
                  }}
               />,
               { duration: Infinity, closeButton: true },
            );
         } else {
            toast.error(
               <TxResultToastView
                  title="Error adding allocations"
                  txError
               />,
               { duration: Infinity, closeButton: true },
            );
         }
      } catch (err) {
         toast.error(
            <TxResultToastView
               title="Error during slice rebalance"
               txError="Error during submitting tx"
            />,
            { duration: Infinity, closeButton: true },
        );
      }
   };

   const addMoreAllocationsDisabled = (allocationsExists ? sliceAllocations.reduce((acc, alloc) => {
      return acc += alloc.actualAllocation;
   }, 0) === 100 : false);

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href="/explorer">Explorer</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               {isInBuildingContext && buildingId ? (
                  <>
                     <BreadcrumbItem>
                        <BreadcrumbLink href={`/building/${buildingId}`}>Building</BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbLink href={`/building/${buildingId}/slices`}>
                           Slices
                        </BreadcrumbLink>
                     </BreadcrumbItem>
                  </>
               ) : (
                  <BreadcrumbItem>
                     <BreadcrumbLink href="/slices">Slices</BreadcrumbLink>
                  </BreadcrumbItem>
               )}
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>{slice.name}</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <Card className="flex flex-col p-0">
            <CardHeader className="w-full p-5 bg-indigo-100">
               <h1 className="text-3xl font-bold">{slice.name}</h1>
               <p className="text-base">{slice.description}</p>
            </CardHeader>

            <CardContent>
               <img
                  src={slice.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={slice.name}
                  style={{ maxHeight: 300 }}
                  className="object-cover rounded-lg w-150"
               />

               <div className="flex flex-row flex-wrap justify-start gap-8 w-full mt-10">
                  {(sliceAllocations?.length > 0 || !!evmAddress) && <div style={{ width: '33%' }}>
                     <SliceAllocations
                        allocations={sliceAllocations}
                        sliceBuildings={sliceBuildings}
                        onOpenAddAllocation={() => {
                           setIsAllocationOpen(true);
                        }}
                     />
                  </div>}

                  {sliceBuildings?.length > 0 && <div>
                     <SliceBuildings buildingsData={sliceBuildingsDetails} />
                  </div>}

                  {!!evmAddress && (
                     <div>
                        <Card className="min-h-100">
                           <CardHeader>
                              <CardTitle>Deposit to Slice</CardTitle>
                              <CardDescription>Deposit amount per Building Token in selected Slice</CardDescription>
                           </CardHeader>
                           <CardContent
                              className={cx("flex flex-col flex-auto", { "h-64": true })}
                           >
                              <DepositToSliceForm onChangeValue={(value: string) => {
                                 if (Number(value) < 100) {
                                    setDepositValueInvalid(true); 
                                 } else {
                                    setDepositValueInvalid(false);
                                    setSliceDepositValue(value);
                                 }
                              }} onSubmitDepositValue={() => {
                                 onSubmitDepositToSliceForm({
                                    depositAmount: sliceDepositValue!,
                                    tokenAssets: mappedSliceAllocations,
                                 })
                              }} />
                              {depositValueInvalid && (
                                 <p className="text-sm text-red-600">Minimum amount to deposit is 100 tokens</p>
                              )}
                           </CardContent>
                        </Card>
                     </div>
                  )}

                  <div className="min-w-80">
                  {(totalDeposits.total || totalDeposits.user) ? (
                     <SliceDepositChart totalStaked={totalDeposits.total} totalUserStaked={totalDeposits.user} />
                  ) : <></>}
               </div>
               </div>
            </CardContent>
         </Card>

         <Dialog open={isAllocationOpen} onOpenChange={isOpened => {
            setIsAllocationOpen(isOpened);
         }}>
            <DialogContent
               onInteractOutside={(e) => e.preventDefault()}
               className="max-w-md border-indigo-100"
            >
               <DialogHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b border-indigo-100 p-6 -m-6 mb-6">
                  Update Allocations and Rebalance
               </DialogHeader>
               <Formik
                     initialValues={{
                        tokenAssets: allocationsExists ? mappedSliceAllocations : [undefined],
                        tokenAssetAmounts: allocationsExists ? sliceAllocations.reduce((acc, alloc) => {
                           return {
                              ...acc,
                              [assetsOptions?.find((opt: any) => opt.tokenAddress === alloc.buildingToken)?.buildingAddress]:
                                 alloc.actualAllocation.toString(),
                           };
                        }, {}) : {},
                        rewardAmount: '100',
                     }}
                     validationSchema={sliceRebalanceSchema}
                     onSubmit={onSubmitAllocationsForm}
                     validateOnChange={false}
                  >
                     {(props) => (
                        <div>
                           <div className="mt-6">
                              <AddSliceAllocationForm
                                 assetOptions={assetsOptions!}
                                 existsAllocations={mappedSliceAllocations}
                                 formik={props}
                                 addMoreAllocationsDisabled={addMoreAllocationsDisabled}
                              />
                           </div>
                           <div className="mt-6 justify-start flex flex-row gap-4">
                              <Button
                                 type="button"
                                 variant="default"
                                 disabled={props.isSubmitting || !props.isValid || !allocationsExists}
                                 onClick={onHandleRebalance}
                              >
                                 Rebalance
                              </Button>
                              <Button
                                 type="submit"
                                 variant="default"
                                 disabled={props.isSubmitting || !props.isValid || addMoreAllocationsDisabled}
                                 onClick={props.submitForm}
                              >
                                 Update Allocation
                              </Button>
                           </div>
                           <div className="mt-6">
                              {props.isSubmitting && <Loader size={64} className="animate-spin" />}
                           </div>
                        </div>
                     )}
                  </Formik>
               </DialogContent>
            </Dialog>
      </div>
   );
}
