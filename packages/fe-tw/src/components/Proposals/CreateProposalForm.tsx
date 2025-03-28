"use client";

import { ProposalType } from "@/types/props";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type CreateProposalFormProps = {
   onSubmit: (newProposal: {
      title: string;
      description: string;
      propType: ProposalType;
      amount?: number;
      to?: string;
      frequency?: number;
      numPayments?: number;
   }) => void;
};

export function CreateProposalForm({ onSubmit }: CreateProposalFormProps) {
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      propType: ProposalType.TextProposal,
      amount: undefined as number | undefined,
      to: "",
      frequency: undefined as number | undefined,
      numPayments: undefined as number | undefined,
   });

   const handleSubmit = () => {
      onSubmit(formData);
      toast.success("Proposal created successfully!");
      setFormData({
         title: "",
         description: "",
         propType: ProposalType.TextProposal,
         amount: undefined,
         to: "",
         frequency: undefined,
         numPayments: undefined,
      });
   };

   return (
      <div className="bg-white rounded-lg">
         <div className="mb-4 flex flex-col gap-4">
            <div>
               <Label htmlFor="title">Proposal Title</Label>
               <Input
                  type="text"
                  className="mt-1"
                  placeholder="Proposal Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
               />
            </div>
            <div>
               <Label htmlFor="description">Proposal Description</Label>
               <Textarea
                  className="mt-1"
                  placeholder="Proposal Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
               />
            </div>

            <div>
               <Label htmlFor="propType">Proposal Type</Label>
               <Select
                  value={formData.propType}
                  onValueChange={(value) =>
                     setFormData({ ...formData, propType: value as ProposalType })
                  }
               >
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="Select Proposal Type" />
                  </SelectTrigger>
                  <SelectContent className="mt-1">
                     <SelectItem value={ProposalType.TextProposal}>Text Proposal</SelectItem>
                     <SelectItem value={ProposalType.PaymentProposal}>Payment Proposal</SelectItem>
                     <SelectItem value={ProposalType.RecurringProposal}>
                        Recurring Proposal
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {formData.propType === ProposalType.PaymentProposal && (
               <>
                  <div>
                     <Label htmlFor="amount">Payment Amount</Label>
                     <Input
                        className="mt-1"
                        type="number"
                        placeholder="Payment Amount"
                        value={formData.amount || ""}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              amount: Number.parseFloat(e.target.value) || undefined,
                           })
                        }
                     />
                  </div>
                  <div>
                     <Label htmlFor="to">Recipient</Label>
                     <Input
                        className="mt-1"
                        type="text"
                        placeholder="Recipient"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                     />
                  </div>
               </>
            )}
            {formData.propType === ProposalType.RecurringProposal && (
               <>
                  <div>
                     <Label htmlFor="amount">Payment Amount</Label>
                     <Input
                        className="mt-1"
                        type="number"
                        placeholder="Payment Amount"
                        value={formData.amount || ""}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              amount: Number.parseFloat(e.target.value) || undefined,
                           })
                        }
                     />
                  </div>
                  <div>
                     <Label htmlFor="to">Recipient</Label>
                     <Input
                        className="mt-1"
                        type="number"
                        placeholder="Frequency (days)"
                        value={formData.frequency || ""}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              frequency: Number.parseInt(e.target.value) || undefined,
                           })
                        }
                     />
                  </div>
                  <div>
                     <Label htmlFor="to">Recipient</Label>
                     <Input
                        className="mt-1"
                        type="number"
                        placeholder="Number of Payments"
                        value={formData.numPayments || ""}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              numPayments: Number.parseInt(e.target.value) || undefined,
                           })
                        }
                     />
                  </div>
               </>
            )}
         </div>
         <div className="flex justify-end mt-5">
            <Button
               type="button"
               onClick={handleSubmit}
               disabled={!formData.title || !formData.description}
            >
               Submit Proposal
            </Button>
         </div>
      </div>
   );
}
