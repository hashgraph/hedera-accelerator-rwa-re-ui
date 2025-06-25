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

   if (!!tokenData) {
      return (
         <Link key={tokenData.address} href={`/building/${tokenData.address}`}>
            <div className="p-4 bg-[#F9F3F8] hover:bg-[#EADFEA] transition duration-200 cursor-pointer">
               <div className="flex flex-row">
                  <span className="text-md mr-2">{tokenData.name}</span>
               </div>
            </div>
         </Link>
      );
   }

   return <></>;
};
