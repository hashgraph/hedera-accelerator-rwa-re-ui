"use client";

import { AdminInfoPanel } from "./AdminInfoPanel";
import { AddBuildingForm } from "./AddBuildingForm";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";

export function BuildingManagementView() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminInfoPanel />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <AddBuildingForm />
        </div>
        <div className="flex-1">
          <AddBuildingTokenLiquidityForm />
        </div>
      </div>
    </div>
  );
}
