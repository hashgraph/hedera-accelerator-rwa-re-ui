"use client";

import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { Button } from "@/components/ui/button";
import { INITIAL_VALUES } from "../Admin/sliceManagement/constants";
import SliceAllocations from "@/components/Slices/SliceAllocations";
import { useBuildings } from "@/hooks/useBuildings";
import { useSliceData } from "@/hooks/useSliceData";
import type { CreateSliceRequestData, SliceAllocation, SliceData } from "@/types/erc3643/types";
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

type Props = {
   slice: SliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

const validateAmountField = (val: any, fieldName: string) => val.when('tokenAssets', ([tokenAssets]: string[][], schema: Yup.Schema) => {
   return schema.test(
      `total_${fieldName}_amount`, `Minimum ${fieldName} amount is 100`,
      (value: string) => tokenAssets?.length > 0 ? !!Number(value) && Number(value) >= 100 : true
   )
});

const validateAssetsField = (val: any) => val.when('allocationAmount', ([allocationAmount]: string[][], schema: Yup.Schema) => {
   return schema.test(
      'token_assets_min', 'Minimum count of assets is is 2',
      (value: string) => value?.length > 0 ? value?.length >=2 : true
   ).test(
      'token_assets_max', 'Maximum count of assets is 5',
      (value: string) => value.length < 5
   )
});

const validationSchema = Yup.object({
   slice: Yup.object(),
   sliceAllocation: Yup.object().shape({
      tokenAssets: validateAssetsField(Yup.array().of(Yup.string())),
      depositAmount: validateAmountField(Yup.string(), 'deposit'),
      rewardAmount: validateAmountField(Yup.string(), 'reward'),
      tokenAssetAmounts: Yup.object(),
      allocationAmount: Yup.string(),
   }),
});

export function SliceDetailPage({ slice, buildingId, isInBuildingContext = false }: Props) {
   const { buildingsInfo } = useBuildings();
   const { sliceAllocations, sliceTokenInfo, sliceBuildings, sliceBuildingsDetails } = useSliceData(
      slice.address,
      buildingsInfo,
   );
   const { data: evmAddress } = useEvmAddress();
   const { addTokenAssetsToSliceMutation } = useCreateSlice(slice.address);
   const [isAllocationOpen, setIsAllocationOpen] = useState(false);
   const [assetsOptions, setAssetsOptions] = useState<any>();

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
            setAssetsOptions(buildingsInfo?.filter(
               (b) => !sliceAllocations.find((alloc) => balancesToTokens.find((b2) => b2.building === b.buildingAddress)?.balance > 0 && buildingsInfo.find(info => info.tokenAddress === alloc.buildingToken)?.buildingAddress === b.buildingAddress)
            ));
         }
      }
   };

   const onSubmitForm = async (values: CreateSliceRequestData) => {
      try {
         const newAllocationAssets = values.sliceAllocation?.tokenAssets?.filter((asset) =>
           !sliceAllocations.find((alloc) => alloc.buildingToken === asset)
         );

         if (newAllocationAssets?.length > 0) {
            const { data, error }= await tryCatch(addTokenAssetsToSliceMutation.mutateAsync({
               ...values,
               sliceAllocation: {
                  ...values.sliceAllocation,
                  tokenAssets: newAllocationAssets,
               },
            }));

            if (data) {
               toast.success(
                  <TxResultToastView
                     title={`Slice ${slice.name} successfully rebalanced`}
                     txSuccess={{
                        transaction_id: (data as unknown as string[])[0],
                     }}
                  />,
                  {
                     duration: 5000,
                  },
               );         
            } else {
               toast.error(
                  <TxResultToastView
                     title={`Error during slice rebalance ${(error as { message: string }).message}`}
                     txError={(error as { message: string }).message}
                  />,
                  { duration: Infinity, closeButton: true },
               );
            }
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
            <div className="md:w-64 md:h-64 w-full h-64">
               <img
                  src={slice.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={slice.name}
                  className="object-cover rounded-lg w-full h-full"
               />
            </div>

            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{slice.name}</h1>
               {slice.description && <p className="text-base mb-4">{slice.description}</p>}

               <div className="bg-white rounded-lg">
                  <h1 className="text-xl font-semibold mb-2">Slice Info</h1>
                  <p>Slice token balance:
                     <span className="text-xs text-purple- font-bold">{' ' + sliceTokenInfo?.tokenBalance?.slice(0, 20)}...</span>
                     {sliceTokenInfo?.tokenName}
                  </p>
               </div>
            </div>
         </div>

         <SliceAllocations
            allocations={sliceAllocations}
            sliceBuildings={sliceBuildings}
            onAddAllocation={() => {
               setIsAllocationOpen(true);
            }}
         />

         {isAllocationOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full">
               <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6" style={{ minWidth: '60%' }}>
                  <Formik
                     initialValues={{
                        ...INITIAL_VALUES,
                        sliceAllocation: {
                           ...INITIAL_VALUES.sliceAllocation,
                           tokenAssetAmounts: sliceAllocations.reduce((acc, alloc) => {
                              return {
                                 ...acc,
                                 [alloc.aToken]: alloc.actualAllocation.toString(),
                              };
                           }, {}),
                           tokenAssets: sliceAllocations.map((asset) => asset.buildingToken),
                        },
                     }}
                     validationSchema={validationSchema}
                     onSubmit={onSubmitForm}
                  >
                     {({ isSubmitting, submitForm }) => (
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
                              <AddSliceAllocationForm assetOptions={assetsOptions!} allocations={sliceAllocations} />
                           </div>
                           <div className="mt-6">
                              <Button
                                 type="submit"
                                 variant="default"
                                 disabled={isSubmitting}
                                 onClick={submitForm}
                              >
                                 Add Allocation
                              </Button>
                           </div>
                           <div className="mt-6">
                              {isSubmitting && <Loader size={64} className="animate-spin" />}
                           </div>
                        </div>
                     )}
                  </Formik>
               </div>
            </div>
         )}

         {sliceBuildingsDetails?.length > 0 && <SliceBuildings buildingsData={sliceBuildingsDetails} />}
      </div>
   );
}
