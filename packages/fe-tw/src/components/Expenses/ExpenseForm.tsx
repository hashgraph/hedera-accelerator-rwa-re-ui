"use client";

import type { ExpenseMethod, ExpenseType } from "@/consts/treasury";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import { useState } from "react";
import { toast } from "react-hot-toast";

type ExpenseFormProps = {
  buildingId: string;
  onCompleted?: (expenseData: {
    title: string;
    amount: number;
    expenseType: ExpenseType;
    method: ExpenseMethod;
    period?: number;
    endDate?: Date;
    percentage?: number;
    notes?: string;
  }) => void;
};

export function ExpenseForm({ buildingId, onCompleted }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState<ExpenseType>("once-off");
  const [method, setMethod] = useState<ExpenseMethod>("flat");
  const [period, setPeriod] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentage, setPercentage] = useState("");
  const [notes, setNotes] = useState("");

  const { makePayment } = useTreasuryData();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Invalid expense amount");
      return;
    }

    try {
      await makePayment({ to: "0xExpenseRecipient", amount: amt });
      toast.success("Expense payment made from the treasury!");
    } catch (err) {
      toast.error(`Could not make treasury payment: ${err}`);
      return;
    }

    if (onCompleted) {
      onCompleted({
        title,
        amount: amt,
        expenseType,
        method,
        period: period ? Number.parseFloat(period) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        percentage: percentage ? Number.parseFloat(percentage) : undefined,
        notes,
      });
    }

    setTitle("");
    setAmount("");
    setExpenseType("once-off");
    setMethod("flat");
    setPeriod("");
    setEndDate("");
    setPercentage("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-700">
        Submit an expense. If approved, a payment is made from the treasury.
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
          onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
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
          onChange={(e) => setMethod(e.target.value as ExpenseMethod)}
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
          className="textarea textarea-bordered w-full max-w-lg"
          placeholder="Optional notes or memo..."
          rows={2}
          style={{ resize: "vertical", maxHeight: "120px" }}
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
