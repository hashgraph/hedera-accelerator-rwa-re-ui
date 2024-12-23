import { use } from "react";
import ExpenseForm from "@/components/Expenses/ExpenseForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ExpensesPage({ params }: Props) {
  const { id } = await params; 

  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold mb-4">Expenses - Building {id}</h2>
      <ExpenseForm buildingId={id} />
    </div>
  );
}
