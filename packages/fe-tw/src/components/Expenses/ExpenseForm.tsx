"use client";

import { useState } from "react";
import { useTreasuryData } from "@/hooks/useTreasuryData";

export default function ExpenseForm({ buildingId }: { buildingId: string }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("once-off");
  const [method, setMethod] = useState("flat");
  const [period, setPeriod] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentage, setPercentage] = useState("");
  const [notes, setNotes] = useState("");

  const { makePayment } = useTreasuryData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid expense amount");
      return;
    }

    // TODO: replace mock
    await makePayment({ to: "0xExpenseRecipient", amount: amt });
    alert("Expense payment made from the treasury!");

    setTitle("");
    setAmount("");
    setExpenseType("once-off");
    setMethod("flat");
    setPeriod("");
    setEndDate("");
    setPercentage("");
    setNotes("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow border-2 border-gray-300 space-y-4"
    >
      <p className="mb-4">
        Submit an expense request. If approved, payment is made from the treasury.
      </p>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="title">
          Expense Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          placeholder="e.g. Office Supplies"
          required
        />
      </div>

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
        <label className="block mb-1 font-semibold" htmlFor="expenseType">
          Expense Type
        </label>
        <select
          id="expenseType"
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="once-off">Once-off</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      {expenseType === "recurring" && (
        <>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="period">
              Recurring Period (days)
            </label>
            <input
              id="period"
              type="number"
              min="1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input input-bordered w-full"
              placeholder="e.g. 30"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block mb-1 font-semibold" htmlFor="method">
          Expense Method
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="flat">Flat Amount</option>
          <option value="percentage">% of Revenue</option>
        </select>
      </div>

      {method === "percentage" && (
        <div>
          <label className="block mb-1 font-semibold" htmlFor="percentage">
            Percentage of Revenue (%)
          </label>
          <input
            id="percentage"
            type="number"
            step="0.1"
            min="0"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="input input-bordered w-full"
            placeholder="e.g. 10"
            required
          />
        </div>
      )}

      <div>
        <label className="block mb-1 font-semibold" htmlFor="notes">
          Notes (Memo)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Optional notes or memo..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
      >
        Submit Expense
      </button>
    </form>
  );
}
