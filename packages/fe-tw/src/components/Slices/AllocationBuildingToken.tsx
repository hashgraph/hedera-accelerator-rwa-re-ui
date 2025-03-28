import { useBuildings } from "@/hooks/useBuildings";
import type { BuildingToken, SliceAllocation } from "@/types/erc3643/types";
import { Diamond as DiamongIcon } from "@mui/icons-material";
import Link from "next/link";

type Props = {
   sliceBuildings: BuildingToken[];
   allocation: SliceAllocation;
   showOnDetails?: boolean;
};

export const AllocationBuildingToken = ({
   sliceBuildings,
   allocation,
   showOnDetails = false,
}: Props) => {
   const buildingToken = sliceBuildings.find((_) => _?.tokenAddress === allocation.buildingToken);
   const { buildings } = useBuildings();

   const building = buildings.find((item) => item.address === buildingToken?.buildingAddress);

   if (building) {
      return (
         <Link key={building.address} href={`/building/${building.address}`}>
            <div className="p-4 rounded-lg bg-[#F9F3F8] hover:bg-[#EADFEA] transition duration-200 cursor-pointer">
               <img
                  src={building.imageUrl ?? "/assets/dome.jpeg"}
                  alt={building.title}
                  className="mb-2 w-full h-32 object-cover rounded-sm"
               />
               <div className="flex flex-row">
                  <p className="font-bold text-lg">{building.title}</p>
                  <DiamongIcon style={{ width: 20 }} />
               </div>
               {!showOnDetails && (
                  <>
                     <p className="text-sm text-gray-600">
                        Location: ({building.info.demographics.location} |{" "}
                        {building.info.demographics.state})
                     </p>
                     <p className="text-sm text-gray-700 mt-2">
                        <span className="font-semibold">Ideal Allocation:</span>{" "}
                        {allocation.idealAllocation} {allocation.aTokenName}
                     </p>
                     <p className="text-sm text-gray-700">
                        <span className="font-semibold">Actual Allocation:</span>{" "}
                        {allocation.actualAllocation} {allocation.aTokenName}
                     </p>
                  </>
               )}
            </div>
         </Link>
      );
   }

   return <></>;
};
