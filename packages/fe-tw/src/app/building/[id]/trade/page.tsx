import { use } from "react";
import TradeForm from "@/components/Trade/TradeForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function TradePage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="my-2">
      <h2 className="text-2xl font-bold mb-4">Sell Token for USDC - Building {id}</h2>
      <p className="mb-4">
        Select a building and sell your tokens for USDC.
      </p>
      <TradeForm />
    </div>
  );
}
