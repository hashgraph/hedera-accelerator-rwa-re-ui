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
         <div key={tokenData.address} className="flex flex-row gap-2">
            <div className="p-4 bg-[#F9F3F8] hover:bg-[#EADFEA] transition duration-200 cursor-pointer w-50">
               <p className="text-md font-semibold">{tokenData.name}</p>
            </div>
            <div className="p-4">
               <p className="text-md">
                  {allocation.actualAllocation ? allocation.actualAllocation : "N/A"}
               </p>
            </div>
         </div>
   );
};
