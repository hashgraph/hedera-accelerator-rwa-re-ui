"use client";
import React from "react";

import { activeProposals } from "@/consts/props";
import { Proposal } from "@/components/Cards/Proposals/Proposal";

export default function CardProposals(props: PropTypes) {
	const { color } = { ...defaultProps, ...props };

	return (
		<>
			<div
				className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
			>
				<div className="rounded-t mb-0 px-4 py-3 border-0">
					<div className="flex flex-wrap items-center">
						<div className="relative w-full px-4 max-w-full flex-grow flex-1">
							<h3
								className={`font-semibold text-lg ${color === "light" ? "text-slate-700" : "text-white"}`}
							>
								Proposals
							</h3>
						</div>
					</div>
				</div>
				<div className="block w-full overflow-x-auto">
					{activeProposals.map((proposal) => (
						<div key={proposal.id} className="flex flex-wrap mt-4">
							<div className="w-full mb-2 px-4">
								<Proposal proposal={proposal} />
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

const defaultProps: PropTypes = {
	color: "light",
};

interface PropTypes {
	color?: "light" | "dark";
}
