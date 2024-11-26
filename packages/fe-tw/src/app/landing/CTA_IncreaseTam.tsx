import React from "react";

export function CTA_IncreaseTam() {
	return (
		<div className="w-full md:w-4/12 px-4 text-center">
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
				<div className="px-4 py-5 flex-auto">
					<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
						<i className="fas fa-retweet" />
					</div>
					<h6 className="text-xl font-semibold">Increase your market</h6>
					<p className="mt-2 mb-4 text-slate-500">
						Use DeFi techniques to compose your REIT into marketable chunks,
						allowing better choices for your investors
					</p>
				</div>
			</div>
		</div>
	);
}
