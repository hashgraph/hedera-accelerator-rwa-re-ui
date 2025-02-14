"use client";

import React, { useEffect, useState } from "react";
import {
  getAuditRecordIdsForBuilding,
  getAuditRecordDetails
} from "@/services/auditRegistryService";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { CopeData } from "@/types/cope";
import { CopeModal } from "./CopeModal";

interface CopeViewProps {
  buildingAddress: string; 
  isAdmin: boolean;
}

export function CopeView({ buildingAddress, isAdmin }: CopeViewProps) {
  const [copeData, setCopeData] = useState<CopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function loadLatestCopeData() {
    try {
      setLoading(true);
      setError(null);
      setCopeData(null);

      const recordIds = await getAuditRecordIdsForBuilding(buildingAddress);
      if (recordIds.length === 0) {
        return; 
      }

      const latestId = recordIds[recordIds.length - 1];
      const record = await getAuditRecordDetails(latestId);
      const ipfsHash = record.ipfsHash || record[2]; 
      if (!ipfsHash) return;

      const data = await fetchJsonFromIpfs(ipfsHash);
      setCopeData(data as CopeData);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load COPE data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLatestCopeData();
  }, [buildingAddress]);

  if (loading) {
    return <div>Loading COPE data...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!copeData) {
    return (
      <div>
        <p>No COPE data found for building {buildingAddress}.</p>
        {isAdmin && (
          <button className="btn" onClick={() => setShowModal(true)}>
            Add COPE Data
          </button>
        )}
        {showModal && (
          <CopeModal
            buildingAddress={buildingAddress}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-bold mb-2">COPE Data (Latest Record)</h2>
      <p><strong>Provider:</strong> {copeData.insuranceProvider ?? "N/A"}</p>
      <p><strong>Coverage:</strong> {copeData.coverageAmount ?? "N/A"}</p>
      <p><strong>Start:</strong> {copeData.coverageStart ?? "N/A"}</p>
      <p><strong>End:</strong> {copeData.coverageEnd ?? "N/A"}</p>
      <p><strong>Notes:</strong> {copeData.notes ?? "N/A"}</p>

      {isAdmin && (
        <button className="btn mt-4" onClick={() => setShowModal(true)}>
          Add Another COPE Record
        </button>
      )}
      {showModal && (
        <CopeModal
          buildingAddress={buildingAddress}
          existingData={copeData}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
