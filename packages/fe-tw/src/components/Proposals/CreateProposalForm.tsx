"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ProposalType } from "@/types/props";

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
    <div className="p-6 bg-white rounded-lg">
      {/* <h2 className="text-xl font-semibold mb-4 text-center">Create a New Proposal</h2> */}
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full mb-2"
          placeholder="Proposal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Proposal Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <select
          className="select select-bordered w-full mb-4"
          value={formData.propType}
          onChange={(e) =>
            setFormData({
              ...formData,
              propType: e.target.value as ProposalType,
            })
          }
        >
          <option value={ProposalType.TextProposal}>Text Proposal</option>
          <option value={ProposalType.PaymentProposal}>Payment Proposal</option>
          <option value={ProposalType.RecurringProposal}>
            Recurring Proposal
          </option>
        </select>

        {formData.propType === ProposalType.PaymentProposal && (
          <>
            <input
              type="number"
              className="input input-bordered w-full mb-2"
              placeholder="Payment Amount"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || undefined,
                })
              }
            />
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              placeholder="Recipient"
              value={formData.to}
              onChange={(e) =>
                setFormData({ ...formData, to: e.target.value })
              }
            />
          </>
        )}
        {formData.propType === ProposalType.RecurringProposal && (
          <>
            <input
              type="number"
              className="input input-bordered w-full mb-2"
              placeholder="Payment Amount"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || undefined,
                })
              }
            />
            <input
              type="number"
              className="input input-bordered w-full mb-2"
              placeholder="Frequency (days)"
              value={formData.frequency || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frequency: parseInt(e.target.value) || undefined,
                })
              }
            />
            <input
              type="number"
              className="input input-bordered w-full mb-2"
              placeholder="Number of Payments"
              value={formData.numPayments || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numPayments: parseInt(e.target.value) || undefined,
                })
              }
            />
          </>
        )}
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={handleSubmit}
        disabled={!formData.title || !formData.description}
      >
        Submit Proposal
      </button>
    </div>
  );
}
