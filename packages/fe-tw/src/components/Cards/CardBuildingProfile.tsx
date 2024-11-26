"use client";
import React from "react";
import CardPageVisits from "@/components/Cards/CardPageVisits";

import CardDemographics from "@/components/Cards/CardDemographics";
import CardFinancials from "@/components/Cards/CardFinancials";
// components

export default function CardBuildingProfile() {
	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16 text-black">
				<div className="px-6">
					<div className="flex flex-wrap justify-center">
						<div className="w-full px-4 text-left mt-20 grid grid-cols-3 gap-4">
							<div className="w-full col-span-1">
								<div>
									<img
										alt="500 James"
										className="max-w-full rounded-lg shadow-lg"
										src="https://images.unsplash.com/photo-1551361415-69c87624334f?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									/>
								</div>
							</div>
							<div className="w-full bg-slate-100 col-span-2">
								<div>
									<span className="text-xl font-semibold">500 James St</span>
								</div>
								<div className="mb-4">
									<span className="text-xs">Purchased: 2023-10-24</span>
								</div>
								<div>
									<span className="py-4">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit
										esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
										occaecat cupidatat non proident, sunt in culpa qui officia
										deserunt mollit anim id est laborum.
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-10 py-10 border-t border-blueGray-200 text-center grid grid-cols-2 gap-4">
						<div>
							<CardFinancials />
						</div>
						<div>
							<CardDemographics />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
