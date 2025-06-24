"use client";

import React from "react";
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
         <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 pb-10">
            <div className="flex justify-between items-center mb-4">
               <h1 className="text-2xl font-bold">Slice Allocations</h1>
            </div>

            <div className="mb-4">
               <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                     <thead>
                        <tr>
                           <th className="px-4 py-2 border">Building Token</th>
                           <th className="px-4 py-2 border">Current Allocation</th>
                        </tr>
                     </thead>
                     <tbody>
                        {allocations.map((item) => (
                           <tr key={item.aToken}>
                              <td className="px-4 py-2 border text-center">
                                 <AllocationBuildingToken
                                    allocation={item}
                                    showOnDetails
                                 />
                              </td>
                              <td className="px-4 py-2 border text-center">
                                 {item.actualAllocation ? item.actualAllocation : "N/A"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {!!evmAddress && <div className="space-x-4 mt-5">
               <Button
                  type="button"
                  onClick={onOpenAddAllocation}
               >
                  Add Allocation & Rebalance
               </Button>
            </div>}
         </div>
   );
}
