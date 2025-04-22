import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
   convertBuildingNFTsData,
   readBuildingDetails,
   readBuildingsList,
} from "@/services/buildingService";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { includes, map } from "lodash";

export async function BuildingsOverview() {
   const buildings = await readBuildingsList();
   const buildingNftData = await Promise.all(
      buildings[0].map((building) => fetchJsonFromIpfs(building[2])),
   );
   const convertedBuildings = convertBuildingNFTsData(
      buildingNftData.map((data, idx) => ({
         ...data,
         address: buildings[0][idx][0],
         copeIpfsHash: buildings[0][idx][2],
      })),
   );

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {convertedBuildings.map((building) => (
            <Card
               key={building.id}
               className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer p-0 pb-6 gap-2"
            >
               <Link href={`/building/${building.id}`}>
                  <>
                     <img
                        src={building.imageUrl ?? "assets/dome.jpeg"}
                        alt={building.title}
                        className="w-full h-32 object-cover rounded-t-md mb-3 top-0"
                     />
                     <CardContent>
                        <h3 className="text-lg font-semibold">{building.title}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                           {building.description ?? "No description available"}
                        </p>
                     </CardContent>
                  </>
               </Link>
            </Card>
         ))}
      </div>
   );
}
