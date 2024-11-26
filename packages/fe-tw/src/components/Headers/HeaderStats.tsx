import React from "react";
import CardStats from "@/components/Cards/CardStats";

export default function HeaderStats() {
	return (
		<>
			{/* Header */}
			<div className="relative bg-blue-400  md:pt-32 pb-32 pt-12">
				<div className="px-4 md:px-10 mx-auto w-full">
					<div>
						{/* Card stats */}
						<div className="flex flex-wrap">
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="Price"
									statTitle="$30.50"
									statArrow="up"
									statPercent="3.48"
									statPercentColor="text-emerald-500"
									statDescripiron="Since last month"
									statIconName="far fa-chart-bar"
									statIconColor="bg-red-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="Investors"
									statTitle="2,356"
									statArrow="down"
									statPercent="3.48"
									statPercentColor="text-red-500"
									statDescripiron="Since last week"
									statIconName="fas fa-chart-pie"
									statIconColor="bg-orange-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="Revenue (m)"
									statTitle="$1,924"
									statArrow="down"
									statPercent="1.10"
									statPercentColor="text-orange-500"
									statDescripiron="Since yesterday"
									statIconName="fas fa-users"
									statIconColor="bg-pink-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="Revenue Per Token (m)"
									statTitle="$1.5"
									statArrow="up"
									statPercent="12"
									statPercentColor="text-emerald-500"
									statDescripiron="Since last month"
									statIconName="fas fa-percent"
									statIconColor="bg-lightBlue-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
