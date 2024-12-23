"use client";

import { useState } from "react";
import { PaymentAmountInput } from "./PaymentAmountInput";
import { PaymentNotesField } from "./PaymentNotesField";
import { PaymentRevenueTypeSelect } from "./PaymentRevenueTypeSelect";
import { useTreasuryData } from "@/hooks/useTreasuryData";

type PaymentFormProps = {
  buildingId: string;
};

export function PaymentForm({ buildingId }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [revenueType, setRevenueType] = useState("rental");
  const { deposit } = useTreasuryData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid amount");
      return;
    }
    await deposit(amt); 
    alert(`Payment of ${amt} USDC submitted to treasury as ${revenueType} revenue`);
    setAmount("");
    setNotes("");
    setRevenueType("rental");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow border-2 border-gray-300 space-y-4"
    >
      <p className="mb-4">
        Enter the amount of USDC you would like to contribute to the building.
      </p>

      <PaymentAmountInput amount={amount} setAmount={setAmount} />
      <PaymentRevenueTypeSelect revenueType={revenueType} setRevenueType={setRevenueType} />
      <PaymentNotesField notes={notes} setNotes={setNotes} />

      <button
        type="submit"
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
      >
        Submit Payment
      </button>
    </form>
  );
}