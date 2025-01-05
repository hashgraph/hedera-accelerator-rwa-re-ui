import TradeForm from "@/components/Trade/TradeForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TradePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Sell Token for USDC - Building {id}
      </h1>
      <p className="text-base mb-4">
        Select a building and sell your tokens for USDC.
      </p>
      <TradeForm />
    </div>
  );
}
