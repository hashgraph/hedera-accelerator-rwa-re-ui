"use client";

import { usePaymentsData } from "@/hooks/usePaymentsData";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import moment from "moment";
import { useState } from "react";
import { PaymentForm } from "./PaymentForm";

type PaymentsViewProps = {
  buildingId: string;
};

export function PaymentsView({ buildingId }: PaymentsViewProps) {
  const { data } = useTreasuryData();
  const { payments, isLoading, isError, addPayment } =
    usePaymentsData(buildingId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  async function handlePaymentCompleted(
    amount: number,
    revenueType: string,
    notes: string,
  ) {
    try {
      await addPayment({ amount, revenueType, notes });
      setShowPaymentModal(false);
    } catch (err) {
      console.error("Error adding payment record:", err);
      alert("Error adding payment record. Check console.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <p className="text-gray-500 text-base mt-1">
            Manage all incoming DAO revenue and contributions
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
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>

        {isLoading && (
          <p className="text-base text-gray-500">Loading payments...</p>
        )}
        {isError && (
          <p className="text-base text-red-500">Error fetching payments!</p>
        )}

        {!isLoading && !isError && payments && payments.length === 0 ? (
          <p className="text-base text-gray-500">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 uppercase text-sm bg-gray-100 rounded-lg">
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Revenue Type</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition rounded-lg"
                  >
                    <td className="p-3 text-gray-800 rounded-l-lg">
                      {moment(payment.date).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="p-3 text-gray-800">{payment.amount} USDC</td>
                    <td className="p-3 text-gray-800">{payment.revenueType}</td>
                    <td className="p-3 text-gray-800">
                      {payment.notes || "No notes"}
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                        Success
                      </span>
                    </td>
                    <td className="p-3 text-blue-500 rounded-r-lg">
                      <button
                        type="button"
                        className="flex items-center gap-2 hover:underline"
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
          onClick={() => setShowPaymentModal(true)}
          className="btn btn-primary text-white text-base font-normal"
        >
          Add Payment
        </button>
      </div>

      {showPaymentModal && (
        <PaymentModal
          buildingId={buildingId}
          onClose={() => setShowPaymentModal(false)}
          onPaymentCompleted={handlePaymentCompleted}
        />
      )}
    </div>
  );
}

function PaymentModal({
  buildingId,
  onClose,
  onPaymentCompleted,
}: {
  buildingId: string;
  onClose: () => void;
  onPaymentCompleted: (
    amount: number,
    revenueType: string,
    notes: string,
  ) => Promise<void>;
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
        <h3 className="font-bold text-2xl mb-4">Add Payment</h3>

        <PaymentForm buildingId={buildingId} onCompleted={onPaymentCompleted} />
      </div>
    </div>
  );
}
