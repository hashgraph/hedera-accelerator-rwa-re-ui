import { use } from "react";
import { CopeView } from "@/components/Cope/CopeView";

// Mock admin check function
function isAdmin(): boolean {
  return true;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default function CopePage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold mb-4">COPE - Building {id}</h2>
      <CopeView buildingId={id} isAdmin={isAdmin()} />
    </div>
  );
}
