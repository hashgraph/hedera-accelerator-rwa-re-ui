"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import type { WalletInterface } from "@/services/wallets/WalletInterface";

import {
  CopeData,
  ConstructionInfo,
  OccupancyInfo,
  ProtectionInfo,
  ExposureInfo,
} from "@/types/cope";

import {
  getAuditRecordIdsForBuilding,
  addAuditRecord,
  updateAuditRecord,
} from "@/services/auditRegistryService";
import { uploadJsonToPinata } from "@/services/ipfsService";

interface CopeUpdateModalProps {
  wallet: WalletInterface;      
  buildingId: number;
  existingData?: CopeData;
  onClose: () => void;
}

export function CopeUpdateModal({
  wallet,
  buildingId,
  existingData = {},
  onClose,
}: CopeUpdateModalProps) {
  const [insuranceProvider, setInsuranceProvider] = useState(
    existingData.insuranceProvider ?? ""
  );
  const [coverageAmount, setCoverageAmount] = useState(
    existingData.coverageAmount ?? ""
  );
  const [coverageStart, setCoverageStart] = useState(
    existingData.coverageStart ?? ""
  );
  const [coverageEnd, setCoverageEnd] = useState(
    existingData.coverageEnd ?? ""
  );
  const [notes, setNotes] = useState(existingData.notes ?? "");

  const [construction, setConstruction] = useState<ConstructionInfo>(
    existingData.construction ?? {}
  );
  const [occupancy, setOccupancy] = useState<OccupancyInfo>(
    existingData.occupancy ?? {}
  );
  const [protection, setProtection] = useState<ProtectionInfo>(
    existingData.protection ?? {}
  );
  const [exposure, setExposure] = useState<ExposureInfo>(
    existingData.exposure ?? {}
  );

  const [isSubmitting, setIsSubmitting] = useState(false);


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const copeData: CopeData = {
        insuranceProvider,
        coverageAmount,
        coverageStart,
        coverageEnd,
        notes,
        construction,
        occupancy,
        protection,
        exposure,
      };

      const fileName = `building-${buildingId}`;
      const ipfsHash = await uploadJsonToPinata(copeData, fileName);
      const recordIds = await getAuditRecordIdsForBuilding(buildingId);

      if (recordIds.length === 0) {
        await addAuditRecord(wallet, buildingId, ipfsHash);
        toast.success(
          `Created new Audit Record for Building #${buildingId} with IPFS hash: ${ipfsHash}`
        );
      } else {
        const latestRecord = Number(recordIds[recordIds.length - 1]);
        await updateAuditRecord(wallet, latestRecord, ipfsHash);
        toast.success(
          `Updated Audit Record #${latestRecord} with IPFS hash: ${ipfsHash}`
        );
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add/update record. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">
          Add/Update COPE Data for Building #{buildingId}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Insurance Provider */}
          <div>
            <label className="block mb-1 font-semibold">
              Insurance Provider
            </label>
            <input
              className="input input-bordered w-full"
              type="text"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              required
            />
          </div>

          {/* Coverage Amount */}
          <div>
            <label className="block mb-1 font-semibold">Coverage Amount</label>
            <input
              className="input input-bordered w-full"
              type="text"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              required
            />
          </div>

          {/* Coverage Start */}
          <div>
            <label className="block mb-1 font-semibold">Coverage Start</label>
            <input
              className="input input-bordered w-full"
              type="date"
              value={coverageStart}
              onChange={(e) => setCoverageStart(e.target.value)}
              required
            />
          </div>

          {/* Coverage End */}
          <div>
            <label className="block mb-1 font-semibold">Coverage End</label>
            <input
              className="input input-bordered w-full"
              type="date"
              value={coverageEnd}
              onChange={(e) => setCoverageEnd(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 font-semibold">Notes</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <hr className="my-3" />

          {/* Construction Materials */}
          <div>
            <label className="block mb-1 font-semibold">
              Construction Materials
            </label>
            <input
              className="input input-bordered w-full"
              type="text"
              value={construction.materials ?? ""}
              onChange={(e) =>
                setConstruction((prev) => ({
                  ...prev,
                  materials: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save COPE Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
