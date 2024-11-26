import CardPageVisits from "@/components/Cards/CardPageVisits";
import CardSocialTraffic from "@/components/Cards/CardSocialTraffic";

import CardBuildingProfile from "@/components/Cards/CardBuildingProfile";
import CardProposals from "@/components/Cards/CardProposals";
import React from "react";

export default function Home() {
	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full mb-12 px-4">
					<CardBuildingProfile />
				</div>
			</div>
			<div className="flex flex-wrap mt-4">
				<div className="w-full mb-12 px-4">
					<CardProposals />
				</div>
			</div>
			{/*}
			<div className="flex flex-wrap mt-4">
				<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
					<CardPageVisits />
				</div>
				<div className="w-full xl:w-4/12 px-4">
					<CardSocialTraffic />
				</div>
			</div>
			<div className="flex flex-wrap">.</div>
			*/}
		</>
	);
}
