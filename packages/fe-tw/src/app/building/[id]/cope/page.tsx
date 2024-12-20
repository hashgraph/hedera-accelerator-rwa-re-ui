import { CopeView } from "@/components/Cope/CopeView";

// Mock admin check function
function isAdmin(): boolean {
  return true;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CopePage({ params }: Props) {
  const { id } = await params; 

  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold mb-4">COPE - Building {id}</h2>
      <CopeView buildingId={id} isAdmin={isAdmin()} />
    </div>
  );
}
