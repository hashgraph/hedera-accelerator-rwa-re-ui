"use client";

import { useState } from "react";
import moment from "moment";
import { useTreasuryData } from "@/hooks/useTreasuryData";
import { usePaymentsData } from "@/hooks/usePaymentsData";
import { PaymentForm } from "./PaymentForm";

type PaymentsViewProps = {
  buildingId: string;
};

export function PaymentsView({ buildingId }: PaymentsViewProps) {
  const { data } = useTreasuryData();
  const { payments, isLoading, isError, addPayment } = usePaymentsData(buildingId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  async function handlePaymentCompleted(
    amount: number,
    revenueType: string,
    notes: string
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
          <p className="text-gray-500 text-sm mt-1">
            Manage all incoming DAO revenue and contributions
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

      <div className="overflow-x-auto bg-white">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>

        {isLoading && <p className="text-gray-500">Loading payments...</p>}
        {isError && <p className="text-red-500">Error fetching payments!</p>}

        {!isLoading && !isError && payments && payments.length === 0 ? (
          <p className="text-gray-500">No payments recorded yet.</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-gray-50">Date</th>
                <th className="bg-gray-50">Amount (USDC)</th>
                <th className="bg-gray-50">Revenue Type</th>
                <th className="bg-gray-50">Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover">
                  <td>{moment(payment.date).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.revenueType}</td>
                  <td>{payment.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowPaymentModal(true)}
          className="btn btn-primary"
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
  onPaymentCompleted: (amount: number, revenueType: string, notes: string) => Promise<void>;
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
        <h3 className="font-bold text-lg mb-4">Add Payment</h3>

        <PaymentForm
          buildingId={buildingId}
          onCompleted={onPaymentCompleted}
        />
      </div>
    </div>
  );
}
