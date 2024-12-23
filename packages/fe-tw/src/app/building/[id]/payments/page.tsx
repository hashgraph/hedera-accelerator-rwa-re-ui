import { PaymentForm } from "@/components/Payments/PaymentForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Payments - Building {id}
      </h1>

      <PaymentForm buildingId={id} />
    </div>
  );
}
