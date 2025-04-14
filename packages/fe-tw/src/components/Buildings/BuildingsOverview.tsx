"use client";

import { useBuildings } from "@/hooks/useBuildings";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { ContractId } from "@hashgraph/sdk";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { pinata } from "@/utils/pinata";
import { ethers } from "ethers";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";

const uploadBuildingMetadata = async ({ name, image }) => {
   try {
      const finalJson = {
         name,
         description: "Building description",
         image: image,
         purchasedAt: "2023-10-01",
         attributes: [
            {
               trait_type: "constructedYear",
               value: "2023",
            },
            { trait_type: "type", value: "Residential" },
            { trait_type: "location", value: "Zagreb" },
            { trait_type: "locationType", value: "Cool" },
            {
               trait_type: "tokenSupply",
               value: "100000",
            },
         ],
         cope: {
            construction: {
               materials: "Concrete",
               yearBuilt: "2023",
               roofType: "Flat",
               numFloors: "2",
            },
            occupancy: {
               type: "Residential",
               percentageOccupied: "",
            },
            protection: {
               fire: "",
               sprinklers: "",
               security: "",
            },
            exposure: {
               nearbyRisks: "",
               floodZone: "",
            },
         },
      };

      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();
      const { IpfsHash } = await pinata.upload
         .json(finalJson, {
            metadata: { name: `Building-${name}` },
         })
         .key(keyData.JWT);

      return IpfsHash;
   } catch (error) {
      console.error("Error uploading metadata:", error);
      throw new Error("Failed to upload metadata");
   }
};

export function BuildingsOverview() {
   const { buildings } = useBuildings();
   const { writeContract } = useWriteContract();
   const { data: evmAddress } = useEvmAddress();

   const createBuilding = async (ipfsMetadata) => {
      const tx = await writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newBuilding",
         metaArgs: { gas: 1_200_000 },
         args: [ipfsMetadata],
      });

      console.log("Building created:", tx);
      return tx;
   };

   const createToken = async (building) => {
      const tx = await writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newERC3643Token",
         args: [
            building,
            `Building Token ${Math.random() * 100}`,
            `SYMBOL ${Math.random() * 100}`,
            16,
         ],
      });
      console.log("Token created:", tx);
      return tx;
   };

   const createTreasury = async (building, token) => {
      const reserve = ethers.parseUnits("10000", 6); // 1k USDC reserve
      const npercentage = 20_00; // 20%

      const tx = await writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newTreasury",
         args: [building, token, reserve, npercentage],
      });
      console.log("Treasury created:", tx);
      return tx;
   };

   const createGovernance = async (building, token, treasury) => {
      const name = "Governance";

      const tx = await writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
         abi: buildingFactoryAbi,
         functionName: "newGovernance",
         args: [building, token, treasury],
      });
      console.log("Governance created:", tx);
      return tx;
   };

   const mintTokens = async (token) => {
      const tx = await writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, token),
         abi: tokenAbi,
         functionName: "mint",
         args: [evmAddress, BigInt(Math.floor(Number.parseFloat("100"!) * 10 ** 16))],
      });
      console.log("Tokens minted:", tx);
   };

   const handleCreateWholeBuilding = async () => {
      const ipfsMetadata = await uploadBuildingMetadata({
         name: `Building for Staking ${Math.random() * 100}`,
         image: "ipfs://bafkreifes3uk7thu334mx4o5gtxh5qz7qscyxdvvhoyycmt62gdfo6wvpi",
      });

      const building = await createBuilding(ipfsMetadata);
      const token = await createToken(building);
      const treasury = await createTreasury(building, token);
      const governance = await createGovernance(building, token, treasury);

      await mintTokens(token);
   };

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href="/explorer">Explorer</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                  <BreadcrumbPage>Building</BreadcrumbPage>
               </BreadcrumbItem>
            </BreadcrumbList>
         </Breadcrumb>

         <div className="bg-purple-50 px-6 sm:px-8 md:px-10 py-6 rounded-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Buildings Catalogue</h1>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
               Explore the buildings in our ecosystem. Each building is tokenized and forms part of
               the investment opportunities in the platform.
            </p>

            <Button onClick={handleCreateWholeBuilding}>Create building</Button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {buildings.map((building) => (
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
      </div>
   );
}
