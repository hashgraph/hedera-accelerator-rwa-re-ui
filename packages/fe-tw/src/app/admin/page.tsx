"use client";

import { useDeployToken } from "@/hooks/erc3643/mutations/useDeployToken";

export default function Home() {
	const {
		error,
		isPending,
		data: deployResult,
		mutateAsync: deployToken,
	} = useDeployToken();

	return (
		<>
			<button
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
