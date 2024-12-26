"use client";

import { AssociateTokenForm } from "@/components/Forms/AssociateTokenForm";
import { useWatchTrexFactoryTrexSuiteDeployedEvent } from "@/hooks/erc3643/events/useWatchTrexFactoryTrexSuiteDeployedEvent";
import { useDeployToken } from "@/hooks/erc3643/mutations/useDeployToken";
import {
	useAccountId,
	useBalance,
	useEvmAddress,
	useTokensBalance,
} from "@buidlerlabs/hashgraph-react-wallets";

export default function Home() {
	const {
		error,
		isPending,
		data: deployResult,
		mutateAsync: deployToken,
	} = useDeployToken();

	const { data: accountId } = useAccountId();
	const { data: evmAddress } = useEvmAddress();
	const { data: balance } = useBalance();
	console.log("L16 accountId ===", accountId);
	console.log("L19 evmAddress ===", evmAddress);
	console.log("L20 balance ===", balance);

	const { data: ownedTokens, isLoading: isLoadingTokens } = useTokensBalance({
		// accountId: "0.0.1990009",
		accountId: accountId,
		autoFetch: !!accountId,
	});

	console.log("L28 ownedTokens ===", ownedTokens);

	// const { deployedTokens } = useWatchTrexFactoryTrexSuiteDeployedEvent();
	// console.log("L17 RENDER deployedTokens ===", deployedTokens);

	return (
		<>
			<div className="p-10">
				<AssociateTokenForm />
			</div>
			<div className="p-10">
				<div>Owned tokens:</div>
				{isLoadingTokens ? (
					"Fetching..."
				) : ownedTokens?.length > 0 ? (
					<ul>
						{ownedTokens.map(
							({ token_id, balance }: { token_id: any; balance: any }) => (
								<li key={token_id}>
									<span>{token_id}</span> - <span>{balance}</span>
								</li>
							),
						)}
					</ul>
				) : (
					"Nothing to show"
				)}
			</div>
			<div className="p-10">
				<input
					type="text"
					placeholder="Type here"
					className="input input-bordered w-full max-w-xs"
				/>

				<button type="button" className="btn btn-primary">
					Button
				</button>

				<label className="form-control w-full max-w-xs">
					<div className="label">
						<span className="label-text">What is your name?</span>
						<span className="label-text-alt">Top Right label</span>
					</div>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-xs"
					/>
					<div className="label">
						<span className="label-text-alt">Bottom Left label</span>
						<span className="label-text-alt">Bottom Right label</span>
					</div>
				</label>
			</div>
			<button
				type="button"
				onClick={() =>
					deployToken({
						name: "123",
						symbol: "123",
						decimals: 8,
						complianceModules: [],
						complianceSettings: [],
					})
				}
			>
				deploy
			</button>
		</>
	);
}
