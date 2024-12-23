import { CopeView } from "@/components/Cope/CopeView";

// TODO: replace mock admin check function
function isAdmin(): boolean {
  return true;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CopePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        COPE - Building {id}
      </h1>

      <CopeView buildingId={id} isAdmin={isAdmin()} />
    </div>
  );
}
