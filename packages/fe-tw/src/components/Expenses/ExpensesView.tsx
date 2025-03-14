"use client";

import { useExpensesData } from "@/hooks/useExpensesData";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import moment from "moment";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";

type ExpensesViewProps = {
  buildingId: string;
};

export function ExpensesView({ buildingId }: ExpensesViewProps) {
  const { data } = useTreasuryData();
  const { expenses, isLoading, isError, addExpense } =
    useExpensesData(buildingId);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <p className="text-gray-500 text-base mt-1">
            Submit and track building expenses paid from the treasury
          </p>
        </div>

        {data && (
          <div className="text-right">
            <p className="text-gray-500 text-base">Treasury Balance</p>
            <p className="text-2xl font-semibold">
              {data.balance.toLocaleString()} USDC
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Expense History</h2>

        {isLoading && (
          <p className="text-base text-gray-500">Loading expenses...</p>
        )}
        {isError && (
          <p className="text-base text-red-500">Error fetching expenses!</p>
        )}

        {!isLoading && !isError && expenses && expenses.length === 0 ? (
          <p className="text-base text-gray-500">No expenses recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse rounded-lg">
              <thead>
                <tr className="text-gray-600 uppercase text-sm bg-gray-100 rounded-lg">
                  <th className="p-3">Date</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses?.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition rounded-lg"
                  >
                    <td className="p-3 text-gray-800 rounded-l-lg">
                      {moment(expense.dateCreated).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="p-3 text-gray-800">{expense.title}</td>
                    <td className="p-3 text-gray-800">{expense.amount} USDC</td>
                    <td className="p-3 text-gray-800">{expense.expenseType}</td>
                    <td className="p-3 text-gray-800">{expense.method}</td>
                    <td className="p-3 text-gray-800">
                      {expense.notes || "No notes"}
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                        Success
                      </span>
                    </td>
                    <td className="p-3 text-blue-500 rounded-r-lg">
                      <button
                        className="flex items-center gap-2 hover:underline"
                        type="button"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary text-white text-base font-normal"
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
          type="button"
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-2xl mb-4">Add Expense</h3>

        <ExpenseForm buildingId={buildingId} onCompleted={onExpenseCompleted} />
      </div>
    </div>
  );
}
