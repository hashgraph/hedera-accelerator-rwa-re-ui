"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";

import { CopeData } from "@/types/cope";
import {
  addAuditRecord
} from "@/services/auditRegistryService";
import { uploadJsonToPinata } from "@/services/ipfsService";

interface CopeModalProps {
  buildingId: number;   
  existingData?: CopeData; 
  onClose: () => void;
}

export function CopeModal({
  buildingId,
  existingData = {},
  onClose
}: CopeModalProps) {
  const { writeContract } = useWriteContract();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [insuranceProvider, setInsuranceProvider] = useState(existingData.insuranceProvider ?? "");
  const [coverageAmount, setCoverageAmount] = useState(existingData.coverageAmount ?? "");
  const [coverageStart, setCoverageStart] = useState(existingData.coverageStart ?? "");
  const [coverageEnd, setCoverageEnd] = useState(existingData.coverageEnd ?? "");
  const [notes, setNotes] = useState(existingData.notes ?? "");


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
      };

      const fileName = `building-${buildingId}-cope-${Date.now()}`;
      const ipfsHash = await uploadJsonToPinata(copeData, fileName);

      await addAuditRecord(writeContract, buildingId, ipfsHash);
      toast.success(`Successfully added a new COPE record for building #${buildingId}`);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add COPE record. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">Add COPE Data for Building #{buildingId}</h3>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Insurance Provider */}
          <div>
            <label className="block mb-1 font-semibold">Insurance Provider</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              required
            />
          </div>

          {/* Coverage Amount */}
          <div>
            <label className="block mb-1 font-semibold">Coverage Amount</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              required
            />
          </div>

          {/* Coverage Start */}
          <div>
            <label className="block mb-1 font-semibold">Coverage Start</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={coverageStart}
              onChange={(e) => setCoverageStart(e.target.value)}
              required
            />
          </div>

          {/* Coverage End */}
          <div>
            <label className="block mb-1 font-semibold">Coverage End</label>
            <input
              type="date"
              className="input input-bordered w-full"
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add COPE Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
