import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import React, { useEffect } from "react";

type Props = {
	address: `0x${string}`;
	setBuildingTokens: any;
};

export const BuildingDetailsView = ({ address, setBuildingTokens }: Props) => {
	const { deployedBuildingTokens } = useBuildingDetails(address);

	useEffect(() => {
		if (deployedBuildingTokens?.length) {
			setBuildingTokens((prev: any) => [...prev, ...deployedBuildingTokens]);
		}
	}, [deployedBuildingTokens?.length]);

	return <></>;
};
