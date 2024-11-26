import React from "react";

export function CTA_Hedera() {
	return (
		<div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
				<div className="px-4 py-5 flex-auto">
					<div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
						<i className="fas fa-award" />
					</div>
					<h6 className="text-xl font-semibold">Why Hedera?</h6>
					<p className="mt-2 mb-4 text-slate-500">
						Let us demonstrate why Hedera should be your choice when it comes to
						tokenizing your asssets.
					</p>
				</div>
			</div>
		</div>
	);
}
