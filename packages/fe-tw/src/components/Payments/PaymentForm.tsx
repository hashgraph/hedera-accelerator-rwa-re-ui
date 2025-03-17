"use client";

import { useTreasuryData } from "@/hooks/useTreasuryData";
import { useState } from "react";
import { toast } from "react-hot-toast";

type PaymentFormProps = {
  buildingId: string;
  onCompleted?: (amount: number, revenueType: string, notes: string) => void;
};

export function PaymentForm({ buildingId, onCompleted }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [revenueType, setRevenueType] = useState("rental");
  const [notes, setNotes] = useState("");

  const { deposit } = useTreasuryData();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Invalid amount");
      return;
    }

    try {
      await deposit(amt);
      toast.success(
        `Payment of ${amt} USDC submitted to treasury as ${revenueType} revenue.`,
      );

      if (onCompleted) {
        onCompleted(amt, revenueType, notes);
      }
      setAmount("");
      setRevenueType("rental");
      setNotes("");
    } catch (err) {
      toast.error(`Error depositing to treasury: ${err}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="mb-4 text-sm text-gray-700">
        Enter the amount of USDC you would like to contribute to Building{" "}
        {buildingId}.
      </p>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="amount">
          Amount (USDC)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter amount in USDC"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="revenueType">
          Revenue Type
        </label>
        <select
          id="revenueType"
          value={revenueType}
          onChange={(e) => setRevenueType(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="rental">Rental</option>
          <option value="parking">Parking Fees</option>
          <option value="advertising">Advertising Revenue</option>
          <option value="service">Service Charges</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="notes">
          Notes (Memo)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Optional memo..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
      >
        Submit Payment
      </button>
    </form>
  );
}
