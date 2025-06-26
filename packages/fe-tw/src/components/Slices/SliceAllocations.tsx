"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { Button } from "@/components/ui/button";
import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { AllocationBuildingToken } from "./AllocationBuildingToken";

type AllocationsProps = {
   allocations: SliceAllocation[];
   sliceBuildings: BuildingToken[];
   onOpenAddAllocation: () => void;
};

export default function SliceAllocations({ allocations, onOpenAddAllocation }: AllocationsProps) {
   const { data: evmAddress } = useEvmAddress();
   
   return (
      <Card>
         <CardHeader>
            <CardTitle>Allocations</CardTitle>
         </CardHeader>

         <CardContent>
            <div className="mb-4 flex flex-col gap-2">
               {allocations?.length === 0 ? <p className="text-sm">No allocations added to slice before</p> : (
                  allocations.map((item) => (
                     <AllocationBuildingToken
                        allocation={item}
                        showOnDetails
                        key={item.aToken}
                     />
                  ))
               )}
            </div>

            {!!evmAddress && <div className="space-x-4 mt-5">
               <Button
                  type="button"
                  onClick={onOpenAddAllocation}
               >
                  Update Allocation & Rebalance
               </Button>
            </div>}
         </CardContent>
      </Card>
   );
}
