"use client";

import { CountryComplianceModule } from "./CountryComplianceModule";

type CompliancesViewProps = {
   buildingId: string;
   buildingAddress: `0x${string}`;
};

export function CompliancesView({ buildingId, buildingAddress }: CompliancesViewProps) {
   return (
      <div className="space-y-6">
         <CountryComplianceModule buildingId={buildingId} buildingAddress={buildingAddress} />
         {/* Future compliance modules can be added here */}
      </div>
   );
}
