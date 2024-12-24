import { ExpensesView } from "@/components/Expenses/ExpensesView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ExpensesPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <ExpensesView buildingId={id} />
    </div>
  );
}
