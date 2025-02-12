"use client";

export function AdminInfoPanel() {
  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
      <p className="text-sm sm:text-base text-gray-700">
        This interface allows the management of buildings by adding new ones to the platform, as well as liquidity management.
      </p>
      <p className="mt-4 text-sm sm:text-base text-gray-700">
        Filling in the building form creates a new building.
        Adding liquidity ensures there's tokens for trading.
      </p>
    </div>
  );
}
