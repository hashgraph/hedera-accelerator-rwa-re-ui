import Link from "next/link";
import { useChain } from "@buidlerlabs/hashgraph-react-wallets";

export const TransactionLink = ({ hash }: { hash: string }) => {
    const { data: chainData } = useChain();

    const blockExplorerUrl = chainData?.chain?.blockExplorers?.default?.url;

    return (
        <Link target="_blank" href={`${blockExplorerUrl}/transaction/${hash}`} style={{ textDecoration: 'underline' }}>
            Deployed Tx Hash: {hash}
        </Link>
    );
};
