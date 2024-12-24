import { PaymentsView} from "@/components/Payments/PaymentsView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaymentsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <PaymentsView buildingId={id} />
    </div>
  );
}
