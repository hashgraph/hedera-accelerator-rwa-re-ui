"use client";
import React from "react";

type RebalanceModalProps = {
  isOpen: boolean;
  allocations: Array<{
    tokenAddress: string;
    building: {
      name?: string;
    };
    idealAllocation: string;
    actualAllocation: string;
  }>;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function RebalanceModal({
  isOpen,
  allocations,
  onClose,
  onConfirm,
  onCancel,
}: RebalanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Allocations & Rebalancing Option</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-4">Rebalance Token Allocations?</p>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Building</th>
                  <th className="px-4 py-2 border">Current Allocation</th>
                  <th className="px-4 py-2 border">Ideal Allocation</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item) => (
                  <tr key={item.tokenAddress}>
                    <td className="px-4 py-2 border text-center">{item.building.name}</td>
                    <td className="px-4 py-2 border text-center">{item.actualAllocation || "N/A"}</td>
                    <td className="px-4 py-2 border text-center">{item.idealAllocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm rebalance
          </button>
        </div>
      </div>
    </div>
  );
}
