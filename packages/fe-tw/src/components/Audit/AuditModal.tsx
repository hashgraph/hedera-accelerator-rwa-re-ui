import type { AuditData } from "@/consts/audit";
import useWriteContract from "@/hooks/useWriteContract";
import { addAuditRecord } from "@/services/auditRegistryService";
import { pinata } from "@/utils/pinata";
import React, { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface AuditModalProps {
   buildingAddress: string;
   existingData?: AuditData;
   onClose: () => void;
}

export function AuditModal({ buildingAddress, existingData = {}, onClose }: AuditModalProps) {
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
         const AuditData: AuditData = {
            insuranceProvider,
            coverageAmount,
            coverageStart,
            coverageEnd,
            notes,
         };

         const fileName = `building-${buildingAddress}-Audit-${Date.now()}`;

         const keyRequest = await fetch("/api/pinataKey");
         const keyData = await keyRequest.json();
         const { IpfsHash } = await pinata.upload
            .json(AuditData, {
               metadata: { name: fileName },
            })
            .key(keyData.JWT);

         await addAuditRecord(writeContract, buildingAddress, IpfsHash);
         toast.success(`Created Audit audit record for building ${buildingAddress}`);
         onClose();
      } catch (err) {
         console.error(err);
         toast.error("Failed to add Audit record");
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <div className="modal modal-open">
         <div className="modal-box max-w-xl relative">
            <button
               type="button"
               className="btn btn-sm btn-circle absolute right-2 top-2"
               onClick={onClose}
            >
               ✕
            </button>
            <h3 className="font-bold text-lg">Add Audit Data for {buildingAddress}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
               {/* Insurance Provider */}
               <div>
                  <label className="block mb-1 font-semibold" htmlFor="">
                     Insurance Provider
                  </label>
                  <input
                     className="input w-full"
                     type="text"
                     value={insuranceProvider}
                     onChange={(e) => setInsuranceProvider(e.target.value)}
                     required
                  />
               </div>

               {/* Coverage Amount */}
               <div>
                  <label className="block mb-1 font-semibold" htmlFor="">
                     Coverage Amount
                  </label>
                  <input
                     className="input w-full"
                     type="text"
                     value={coverageAmount}
                     onChange={(e) => setCoverageAmount(e.target.value)}
                     required
                  />
               </div>

               {/* Coverage Start */}
               <div>
                  <label className="block mb-1 font-semibold" htmlFor="">
                     Coverage Start
                  </label>
                  <input
                     className="input w-full"
                     type="date"
                     value={coverageStart}
                     onChange={(e) => setCoverageStart(e.target.value)}
                     required
                  />
               </div>

               {/* Coverage End */}
               <div>
                  <label className="block mb-1 font-semibold" htmlFor="">
                     Coverage End
                  </label>
                  <input
                     className="input w-full"
                     type="date"
                     value={coverageEnd}
                     onChange={(e) => setCoverageEnd(e.target.value)}
                     required
                  />
               </div>

               {/* Notes */}
               <div>
                  <label className="block mb-1 font-semibold" htmlFor="">
                     Notes
                  </label>
                  <textarea
                     className="textarea textarea-bordered w-full"
                     rows={3}
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                  />
               </div>

               <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Audit Data"}
               </button>
            </form>
         </div>
      </div>
   );
}
