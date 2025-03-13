"use client";

import { AccountBalance } from "@/components/Account/AccountBalance";
import { AccountOwnedTokensList } from "@/components/Account/AccountOwnedTokensList";
import { DeployBuilding } from "@/components/Account/DeployBuilding";
import { DeployBuildingMetadata } from "@/components/Account/DeployBuildingMetadata";
import { AssociateTokenForm } from "@/components/Forms/AssociateTokenForm";
import { useState } from "react";

export default function Home() {
  const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");

  return (
    <>
      <div className="p-10">
        <DeployBuildingMetadata
          setDeployedMetadataIPFS={setDeployedMetadataIPFS}
        />
      </div>
      <div className="p-10">
        <DeployBuilding deployedMetadataIPFS={deployedMetadataIPFS} />
      </div>
      <div className="p-10">
        <AssociateTokenForm />
      </div>
      <div className="p-10">
        <AccountBalance />
      </div>
      <div className="p-10">
        <AccountOwnedTokensList />
      </div>
    </>
  );
}
