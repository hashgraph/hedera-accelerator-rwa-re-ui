import React from "react";

export function REIT30() {
	return (
		<section className="pb-20 relative block bg-slate-800">
			<div
				className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
				style={{ transform: "translateZ(0)" }}
			>
				<svg
					className="absolute bottom-0 overflow-hidden"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					version="1.1"
					viewBox="0 0 2560 100"
					x="0"
					y="0"
				>
					<title>&nbsp;</title>
					<polygon
						className="text-slate-800 fill-current"
						points="2560 0 2560 100 0 100"
					/>{" "}
					<polygon
						className="text-slate-800 fill-current"
						points="2560 0 2560 2560 0 100"
					/>
				</svg>
			</div>
			<div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
				<div className="items-center flex flex-wrap">
					<div className="w-full md:w-4/12 ml-auto mr-auto px-4">
						<img
							alt="..."
							className="max-w-full rounded-lg shadow-lg"
							src="/assets/dome.jpeg"
						/>
					</div>
					<div className="w-full md:w-5/12 ml-auto mr-auto px-4">
						<div className="md:pr-12">
							<div className="text-blue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
								<i className="fas fa-rocket text-xl" />
							</div>
							<h3 className="text-3xl font-semibold text-white">
								Let's go further
							</h3>
							<p className="mt-4 text-lg leading-relaxed text-white">
								How do we integrate different compatibility techniques that DeFi
								has introduced to increase the attractiveness of our REIT
							</p>
							<ul className="list-none mt-6">
								<li className="py-2">
									<div className="flex items-center">
										<div>
											<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
												<i className="fas fa-fingerprint" />
											</span>
										</div>
										<div>
											<h4 className="text-white">Price Discovery</h4>
										</div>
									</div>
								</li>
								<li className="py-2">
									<div className="flex items-center">
										<div>
											<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
												<i className="fab fa-html5" />
											</span>
										</div>
										<div>
											<h4 className="text-white">Revenue Composability</h4>
										</div>
									</div>
								</li>
								<li className="py-2">
									<div className="flex items-center">
										<div>
											<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
												<i className="far fa-paper-plane" />
											</span>
										</div>
										<div>
											<h4 className="text-white">Protocol Owned Liquidity</h4>
										</div>
									</div>
								</li>{" "}
								<li className="py-2">
									<div className="flex items-center">
										<div>
											<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
												<i className="fa fa-rocket" />
											</span>
										</div>
										<div>
											<h4 className="text-white">&amp; more</h4>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
