"use client";

import { useState } from "react";
import moment from "moment";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import { useExpensesData } from "@/hooks/useExpensesData";
import { ExpenseForm } from "./ExpenseForm";

type ExpensesViewProps = {
  buildingId: string;
};

export function ExpensesView({ buildingId }: ExpensesViewProps) {
  const { data } = useTreasuryData(); 
  const { expenses, isLoading, isError, addExpense } = useExpensesData(buildingId);
  const [showModal, setShowModal] = useState(false);

  async function handleExpenseCompleted(expenseData: {
    title: string;
    amount: number;
    expenseType: "once-off" | "recurring";
    method: "flat" | "percentage";
    period?: number;
    endDate?: Date;
    percentage?: number;
    notes?: string;
  }) {
    try {
      await addExpense(expenseData);

      setShowModal(false);
    } catch (err) {
      console.error("Error adding expense record:", err);
      alert("Could not add expense record. See console.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <p className="text-gray-500 text-sm mt-1">
            Submit and track building expenses paid from the treasury
          </p>
        </div>

        {data && (
          <div className="text-right">
            <p className="text-gray-500 text-sm">Treasury Balance</p>
            <p className="text-xl font-semibold">
              {data.balance.toLocaleString()} USDC
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border-gray-200">
        <h2 className="text-xl font-bold mb-4">Expense History</h2>

        {isLoading && <p>Loading expenses...</p>}
        {isError && <p className="text-red-600">Error loading expenses!</p>}

        {!isLoading && !isError && expenses && expenses.length === 0 ? (
          <p className="text-gray-500">No expenses recorded yet.</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-gray-50">Date</th>
                <th className="bg-gray-50">Title</th>
                <th className="bg-gray-50">Amount (USDC)</th>
                <th className="bg-gray-50">Type</th>
                <th className="bg-gray-50">Method</th>
                <th className="bg-gray-50">Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses?.map((exp) => (
                <tr key={exp.id} className="hover">
                  <td>{moment(exp.dateCreated).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{exp.title}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.expenseType}</td>
                  <td>{exp.method}</td>
                  <td>{exp.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add Expense
        </button>
      </div>

      {showModal && (
        <ExpenseModal
          buildingId={buildingId}
          onClose={() => setShowModal(false)}
          onExpenseCompleted={handleExpenseCompleted}
        />
      )}
    </div>
  );
}

function ExpenseModal({
  buildingId,
  onClose,
  onExpenseCompleted,
}: {
  buildingId: string;
  onClose: () => void;
  onExpenseCompleted: (expenseData: {
    title: string;
    amount: number;
    expenseType: "once-off" | "recurring";
    method: "flat" | "percentage";
    period?: number;
    endDate?: Date;
    percentage?: number;
    notes?: string;
  }) => Promise<void>;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Add Expense</h3>

        <ExpenseForm
          buildingId={buildingId}
          onCompleted={onExpenseCompleted}
        />
      </div>
    </div>
  );
}
