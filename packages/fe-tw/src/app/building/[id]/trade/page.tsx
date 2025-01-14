import TradeView from "@/components/Trade/TradeView";
import { buildings } from "@/consts/buildings";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TradePage({ params }: Props) {
  const { id } = await params;
  const buildingId = parseInt(id, 10);
  const building = buildings.find((b) => b.id === buildingId);

  if (!building) {
    notFound();
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
      {building.title}: Trade
      </h1>
      <TradeView />
    </div>
  );
}
