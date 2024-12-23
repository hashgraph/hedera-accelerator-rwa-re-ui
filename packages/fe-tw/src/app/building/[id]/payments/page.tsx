import { use } from "react";
import { PaymentForm } from "@/components/Payments/PaymentForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentsPage({ params }: Props) {
  const { id } = await params; 

  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold mb-4">Payments - Building {id}</h2>
      <PaymentForm buildingId={id} />
    </div>
  );
}
