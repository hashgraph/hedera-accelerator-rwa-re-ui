import { getTokenName } from "@/services/erc20Service";
import type { SliceAllocation } from "@/types/erc3643/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
   allocation: SliceAllocation;
   showOnDetails?: boolean;
};

export const AllocationBuildingToken = ({ allocation }: Props) => {
   const [tokenData, setTokenData] = useState<{ name: string, address: string }>();

   useEffect(() => {
      if (allocation.buildingToken) {
         getTokenName(allocation.buildingToken).then(data => {
            setTokenData({
               address: allocation.buildingToken,
               name: data[0],
            });
         });
      }
   }, [allocation.buildingToken]);

   return !!tokenData && (
      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
         <p className="font-semibold text-gray-900">{tokenData.name}</p>
         <p className="text-sm font-semibold text-gray-900">
            {allocation.actualAllocation ? `${allocation.actualAllocation}%` : "N/A"}
         </p>
      </div>
   );
};
