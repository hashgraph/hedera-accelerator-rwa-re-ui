import { useChain } from "@buidlerlabs/hashgraph-react-wallets";
import Link from "next/link";

export const TransactionLink = ({ hash }: { hash: string }) => {
  const { data: chainData } = useChain();

  const blockExplorerUrl = chainData?.chain?.blockExplorers?.default?.url;

  return (
    <Link
      target="_blank"
      href={`${blockExplorerUrl}/transaction/${hash}`}
      style={{ textDecoration: "underline" }}
    >
      Deployed Tx Hash: {hash}
    </Link>
  );
};
