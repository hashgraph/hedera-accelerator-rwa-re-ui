"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCopeData, getCopeIpfsHashForBuilding, updateCopeData } from "@/services/copeService";
import { CopeData } from "@/consts/cope";

export function useCopeData(buildingId: string) {
  const queryClient = useQueryClient();

  const ipfsHash = getCopeIpfsHashForBuilding(buildingId);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["copeData", buildingId],
    queryFn: async () => {
      if (!ipfsHash) return null;
      return await fetchCopeData(ipfsHash);
    },
  });

  const mutation = useMutation({
    mutationFn: (newData: Partial<CopeData>) => {
      if (!ipfsHash) return Promise.reject("No IPFS hash for COPE data");
      return updateCopeData(ipfsHash, newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["copeData", buildingId],
      });
    },
  });

  async function update(newData: Partial<CopeData>) {
    await mutation.mutateAsync(newData);
  }

  return {
    data,
    isLoading,
    isError,
    updateData: update,
    isUpdating: mutation.status === "pending"
  };
}
