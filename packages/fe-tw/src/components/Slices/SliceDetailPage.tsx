"use client";

import Allocations from "@/components/Slices/Allocations";
import { useSliceData } from "@/hooks/useSliceData";
import type { BuildingToken, SliceData } from "@/types/erc3643/types";
import React, { useState } from "react";
import { AllocationBuildingToken } from "./AllocationBuildingToken";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

interface ExtendedSliceData extends SliceData {
   sliceValuation: number;
   tokenPrice: number;
   tokenBalance: number;
}

type Props = {
   sliceData: ExtendedSliceData;
   isInBuildingContext?: boolean;
   buildingId?: string;
};

export function SliceDetailPage({ sliceData, isInBuildingContext = false, buildingId }: Props) {
   const [buildingDeployedTokens] = useState<BuildingToken[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { sliceAllocations, sliceBuildings } = useSliceData(
      sliceData.address,
      buildingDeployedTokens,
   );

   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);

   const handleConfirmRebalance = () => {
      // todo: add rebalance() call
      closeModal();
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
                  <BreadcrumbPage>{sliceData.name}</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 md:h-64 w-full h-64">
               <img
                  src={sliceData.imageIpfsUrl ?? "/assets/dome.jpeg"}
                  alt={sliceData.name}
                  className="object-cover rounded-lg w-full h-full"
               />
            </div>

            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{sliceData.name}</h1>
               {sliceData.description && <p className="text-base mb-4">{sliceData.description}</p>}

               <div className="bg-white rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">Slice Info</h2>
                  <p className="mb-1">Slice Valuation: ${sliceData.sliceValuation ?? "-"}</p>
                  <p className="mb-1">Token Price: ${sliceData.tokenPrice ?? "-"}</p>
                  <p>Your Balance: {sliceData.tokenBalance ?? 0} tokens</p>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-gray-800 mb-4">Slice Token Allocations</h2>
               <Button type="button" onClick={openModal}>
                  Show all
               </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {sliceAllocations.map((item) => (
                  <AllocationBuildingToken
                     key={item.aToken}
                     allocation={item}
                     sliceBuildings={sliceBuildings}
                  />
               ))}
            </div>
         </div>

         <Allocations
            isOpen={isModalOpen}
            allocations={sliceAllocations}
            sliceBuildings={sliceBuildings}
            onClose={closeModal}
            onConfirm={handleConfirmRebalance}
         />
      </div>
   );
}
