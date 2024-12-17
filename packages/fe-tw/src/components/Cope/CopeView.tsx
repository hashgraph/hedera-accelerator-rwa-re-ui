"use client";

import { useCopeData } from "@/hooks/useCopeData";
import { CopeAdminUpdateButton } from "@/components/Buttons/CopeAdminUpdateButton";

type CopeViewProps = {
  buildingId: string;
  isAdmin: boolean;
};

export function CopeView({ buildingId, isAdmin }: CopeViewProps) {
  const { data, isLoading, isError, updateData, isUpdating } = useCopeData(buildingId);

  if (isLoading) {
    return <div>Loading COPE data...</div>;
  }

  if (isError) {
    return <div>Error fetching COPE data.</div>;
  }

  if (!data) {
    return <div>No COPE data found for this building.</div>;
  }

  function handleUpdate() {
    // demo purpose only
    updateData({ notes: "Coverage reviewed and confirmed." });
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow border-2 border-gray-300 space-y-4">
      <h3 className="text-xl font-bold">COPE Insurance Data</h3>
      <p><strong>Provider:</strong> {data.insuranceProvider}</p>
      <p><strong>Coverage Amount:</strong> {data.coverageAmount}</p>
      <p><strong>Coverage Start:</strong> {data.coverageStart}</p>
      <p><strong>Coverage End:</strong> {data.coverageEnd}</p>
      {data.notes && <p><strong>Notes:</strong> {data.notes}</p>}

      {isAdmin && (
        <div className="mt-6">
          <CopeAdminUpdateButton onClick={handleUpdate} isLoading={isUpdating} />
        </div>
      )}
    </div>
  );
}
