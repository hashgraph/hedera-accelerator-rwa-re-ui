type Props = {
  params: { id: string };
};

export default function TradePage({ params }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Trade</h2>
      <p>tbc: building - USDC swap page {params.id}.</p>
    </div>
  );
}