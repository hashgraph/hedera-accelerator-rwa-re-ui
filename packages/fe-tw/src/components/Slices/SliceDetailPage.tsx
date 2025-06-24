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

type Props = {
   slice: SliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

export function SliceDetailPage({ slice, buildingId, isInBuildingContext = false }: Props) {
   const { buildingsInfo } = useBuildings();
   const { sliceAllocations, sliceBuildings, sliceBuildingsDetails } = useSliceData(
      slice.address,
      buildingsInfo,
   );
   const { data: evmAddress } = useEvmAddress();
   const { rebalanceSliceMutation, addAllocationsToSliceMutation, depositMutation } = useCreateSlice(slice.address);
   const [isAllocationOpen, setIsAllocationOpen] = useState(false);
   const [assetsOptions, setAssetsOptions] = useState<any[]>();
   const [sliceDepositValue, setSliceDepositValue] = useState<string>();

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
         const { data, error } = await tryCatch(depositMutation.mutateAsync(values));

         if (data) {
            toast.success(
               <TxResultToastView
                  title={`Slice ${slice.name} successfully rebalanced`}
                  txSuccess={{
                     transaction_id: (data as unknown as string[])[0],
                  }}
               />,
               { duration: 5000 },
            );         
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
   
   const onHandleRebalance = async (values: AddSliceAllocationRequestBody) => {
      try {
         const { data, error } = await tryCatch(rebalanceSliceMutation.mutateAsync(values));

         if (data) {
            toast.success(
               <TxResultToastView
                  title={`Slice ${slice.name} successfully rebalanced`}
                  txSuccess={{
                     transaction_id: (data as unknown as string[])[0],
                  }}
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
                  title={'Error during adding allocation: already exists'}
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

         <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-100 md:h-64 w-full h-64">
               <img
                  src={slice.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={slice.name}
                  className="object-cover rounded-lg w-full h-full"
               />

               {!!evmAddress && <Card className="mt-6">
                  <CardHeader>
                     <CardTitle>Deposit to Slice</CardTitle>
                     <CardDescription>Deposit building tokens to Slice is mandatory</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <DepositToSliceForm onChangeValue={(value: string) => {
                        setSliceDepositValue(value);
                     }} onSubmitDepositValue={() => {
                        onSubmitDepositToSliceForm({
                           depositAmount: sliceDepositValue!,
                           tokenAssets: mappedSliceAllocations,
                        })
                     }} />
                  </CardContent>
               </Card>}
            </div>

            <div className="flex-1 flex flex-col gap-4">
               <h1 className="text-3xl font-bold">{slice.name}</h1>
               <p className="text-base">{slice.description}</p>

               <SliceAllocations
                  allocations={sliceAllocations}
                  sliceBuildings={sliceBuildings}
                  onOpenAddAllocation={() => {
                     setIsAllocationOpen(true);
                  }}
               />
            </div>
         </div>

         {isAllocationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full" style={{ minHeight: '100vh' }}>
               <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6" style={{ minWidth: '60%' }}>
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
                           <Button
                              type="button"
                              onClick={() => {
                                 setIsAllocationOpen(false);
                              }}
                              variant="outline"
                              className="text-gray-500 hover:text-gray-700"
                           >
                              ✕
                           </Button>
                           <div className="mt-6">
                              <AddSliceAllocationForm
                                 assetOptions={assetsOptions!}
                                 existsAllocations={mappedSliceAllocations}
                                 formik={props}
                              />
                           </div>
                           <div className="mt-6 flex flex-row gap-4">
                              <Button
                                 type="button"
                                 variant="default"
                                 disabled={props.isSubmitting || !props.isValid || !allocationsExists}
                                 onClick={() => onHandleRebalance(props.values)}
                              >
                                 Rebalance
                              </Button>
                              <Button
                                 type="submit"
                                 variant="default"
                                 disabled={props.isSubmitting || !props.isValid}
                                 onClick={props.submitForm}
                              >
                                 Add Allocation
                              </Button>
                           </div>
                           <div className="mt-6">
                              {props.isSubmitting && <Loader size={64} className="animate-spin" />}
                           </div>
                        </div>
                     )}
                  </Formik>
               </div>
            </div>
         )}

         {sliceBuildings?.length > 0 && <SliceBuildings buildingsData={sliceBuildingsDetails} />}
      </div>
   );
}
