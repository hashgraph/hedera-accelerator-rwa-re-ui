"use client";

import { useWatchTrexFactoryTrexSuiteDeployedEvent } from "@/hooks/erc3643/events/useWatchTrexFactoryTrexSuiteDeployedEvent";
import { useDeployToken } from "@/hooks/erc3643/mutations/useDeployToken";

export default function Home() {
	const {
		error,
		isPending,
		data: deployResult,
		mutateAsync: deployToken,
	} = useDeployToken();

	const { deployedTokens } = useWatchTrexFactoryTrexSuiteDeployedEvent();
	console.log("L17 RENDER deployedTokens ===", deployedTokens);

	return (
		<>
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
