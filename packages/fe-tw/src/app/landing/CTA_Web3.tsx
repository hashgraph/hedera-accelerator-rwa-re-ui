import React from "react";

export function CTA_Web3() {
	return (
		<div className="pt-6 w-full md:w-4/12 px-4 text-center">
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
				<div className="px-4 py-5 flex-auto">
					<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
						<i className="fas fa-fingerprint" />
					</div>
					<h6 className="text-xl font-semibold">Learn new Business Models</h6>
					<p className="mt-2 mb-4 text-slate-500">
						Decentralized finance has introduced new business models. Learn what
						they are, and how they apply to your business
					</p>
				</div>
			</div>
		</div>
	);
}
