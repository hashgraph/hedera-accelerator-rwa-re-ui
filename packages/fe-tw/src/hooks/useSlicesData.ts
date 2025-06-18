import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import type { SliceAllocationSmall, SliceData } from "@/types/erc3643/types";
import { prepareStorageIPFSfileURL } from "@/utils/helpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBuildings } from "./useBuildings";
import { readSliceAllocations, readSliceMetdataUri } from "@/services/sliceService";

export function useSlicesData() {
   const [sliceAddresses, setSliceAddresses] = useState<`0x${string}`[]>([]);
   const [slices, setSlices] = useState<SliceData[]>([]);
   const [sliceLogs, setSliceLogs] = useState<any[]>([]);
   const [recentSliceLogs, setRecentSliceLogs] = useState<any[]>([]);
   const [recentlyDeployedSlice, setRecentlyDeployedSlice] = useState<`0x${string}`>();
   const { buildings, buildingsInfo } = useBuildings();
   
   useEffect(() => {
      const unsubscribe = watchContractEvent({
         address: SLICE_FACTORY_ADDRESS,
         abi: sliceFactoryAbi,
         eventName: "SliceDeployed",
         onLogs: (data) => {
            setSliceLogs(prev => [...prev, ...data]);
         },
      });

      return () => unsubscribe();
   }, []);

   const requestSlicesDetails = useCallback(async () => {
      const slicesMetadataUris = await Promise.all(
         sliceLogs.map((log) => readSliceMetdataUri(log.args[0])),
      );
      const sliceMetdatas = await Promise.all(
         slicesMetadataUris.map((uri: string[]) => fetchJsonFromIpfs(uri[0])),
      );

      setSliceAddresses(sliceLogs.map((log) => log.args[0]));
      setSlices(
         sliceMetdatas.map((m, sliceId) => ({
            id: sliceLogs[sliceId].args[0],
            address: sliceLogs[sliceId].args[0],
            name: m.name,
            allocation: m.allocation,
            description: m.description,
            imageIpfsUrl: prepareStorageIPFSfileURL((m.sliceImageIpfsId || m.sliceImageIpfsHash)?.replace("ipfs://", "")),
            endDate: m.endDate,
            estimatedPrice: 0,
         })),
      );
   }, [sliceLogs]);

   useEffect(() => {
      if (sliceLogs?.length) {
         requestSlicesDetails();
      }
   }, [sliceLogs, requestSlicesDetails]);

   useEffect(() => {
      if ((sliceLogs?.length > 0 && recentSliceLogs?.length > 0) && recentSliceLogs?.length !== sliceLogs?.length) {
         const newDeployedSlice = [...sliceLogs].pop();

         setRecentlyDeployedSlice(newDeployedSlice.args[0]);
      }

      setRecentSliceLogs(sliceLogs);
   }, [sliceLogs?.length]);

   const { data: slicesAllocationsData } = useQuery({
      queryKey: [
         "sliceAllocations",
         slices.map(slice => `alloc_${slice.address}`)
      ],
      queryFn: async () => {
         const allocationsData = await Promise.allSettled(slices.map(slice => readSliceAllocations(slice.address)));

         return allocationsData.map((allocLog, index) => ({
            buildingToken: (allocLog as any).value[0][1][1],
            slice: slices[index].address,
         }));
      },
      enabled: slices?.length > 0,
      initialData: [],
   });

   const buildingToSlices = useMemo(() => {
      if (
         slicesAllocationsData!.length > 0 &&
         (buildings?.length ?? 0) > 0 &&
         (buildingsInfo?.length ?? 0) > 0
      ) {
         const buildingToSlices: {
            [key: `0x${string}`]: SliceData[],
         } = {};

         buildings?.forEach(building => {
            const tokensForBuilding = buildingsInfo?.filter(tok => tok.buildingAddress === building.address);

            if (tokensForBuilding?.length) {
               buildingToSlices[building.address!] = slicesAllocationsData
                  .filter(alloc => tokensForBuilding.find(tok => tok.tokenAddress === alloc.buildingToken))
                  .map(alloc => slices.find(_slice => _slice.address === alloc.slice))
                  .filter(_slice => !!_slice);
            }
         });

         return buildingToSlices;
      }
   }, [slicesAllocationsData, buildingsInfo]);

   return {
      sliceAddresses,
      slicesAllocationsData,
      slices,
      buildingToSlices,
      recentlyDeployedSlice,
   };
}
