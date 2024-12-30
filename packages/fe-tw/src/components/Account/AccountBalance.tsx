import { useBalance } from "@buidlerlabs/hashgraph-react-wallets";

export function AccountBalance() {
	const { data: balance } = useBalance();

	return (
		<>
			<h3>Account balance</h3>
			<p>
				{balance?.value} {balance?.symbol}
			</p>
		</>
	);
}
